import { FourPillarsData } from "@/app/types";
import {
  Modal,
  Button,
  Input,
  useOverlayState
} from "@heroui/react";
import { ChangeEvent, useState, useEffect, type JSX } from "react";
import Link from "next/link";
import { generateUrlFromResult } from "@/utils/url";
import { usePathname } from "next/navigation";
import localForage from "localforage";
import { LocalStorageItem } from "types";
import { v4 as uuidv4 } from "uuid";

const MAX_LOCAL_STORAGE_ENTRY = 100;
const KEY_PREFIX = "fp-";
const DB_NAME = "four-pillars";
const STORE_NAME = "charts";

export default function OptionStorage({
  result
}: {
  result: FourPillarsData;
}): JSX.Element {
  // HeroUI v3: useDisclosure は廃止。useOverlayState の
  // { isOpen, setOpen, open, close } に置き換わった。
  const state = useOverlayState();
  const { nickname } = result;
  const defaultTitle = nickname ? `${nickname}さんの命式` : "";
  const [error, setError] = useState("");
  const [title, setTitle] = useState(defaultTitle);
  const [sharedUrl, setSharedUrl] = useState("");

  const pathName = usePathname();

  useEffect(() => {
    (async () => {
      try {
        const splitPaths = pathName!.split("/");
        if (splitPaths.length === 3 && splitPaths[2] !== "") {
          // 既に保存用URLで表示している場合
          setSharedUrl(`${window.location.origin}${pathName}`);
        } else {
          const urlStr = await generateUrlFromResult(result);
          setSharedUrl(urlStr);
        }
      } catch (error) {
        console.error(error);
        setSharedUrl("");
      }
    })();
  }, []);

  /**
   * 命式入力データからオブジェクトを生成
   *
   * @param {string}
   * @returns
   */
  const createChartObj = async (uuid: string) => {
    const url = sharedUrl
      ? sharedUrl
      : await generateUrlFromResult(result);
    const chartObj = {
      title,
      url,
      createdAt: new Date().getTime()
    };
    return chartObj;
  };

  /**
   * 保存ボタンが押された時のハンドラ
   *
   * @param {() => void} onClose
   * @returns {void}
   */
  const onClickHandler = async (onClose: () => void) => {
    try {
      const message = isValidTitle(title);
      if (message) {
        setError(message);
        return;
      }
      localForage.config({
        name: DB_NAME,
        storeName: STORE_NAME
      });
      const keys = await localForage.keys();
      const filteredKeys = keys.filter(key =>
        key.includes(KEY_PREFIX)
      );
      if (filteredKeys.length >= MAX_LOCAL_STORAGE_ENTRY) {
        setError(
          `Webブラウザに保存できる件数は${MAX_LOCAL_STORAGE_ENTRY}件までです。`
        );
        return;
      }
      const filteredValues = await Promise.all(
        filteredKeys.map(async key => {
          const item: LocalStorageItem = (await localForage.getItem(
            key
          )) as LocalStorageItem;
          return item;
        })
      );
      const sameTitleValue = filteredValues.find(
        item => item.title === title
      );
      if (sameTitleValue) {
        setError(
          "そのタイトルは既に使用されています。別の名称を入力してください。"
        );
        return;
      }
      if (title) {
        const uuid = uuidv4();
        const chartObj = await createChartObj(uuid);
        await localForage.setItem(`${KEY_PREFIX}${uuid}`, chartObj);
        onClose();
        setTitle("");
        setError("");
        return;
      }
    } catch (error) {
      console.error(error);
      setError(
        "Webブラウザにデータを保存することができませんでした。"
      );
      return;
    }
  };

  /**
   * モーダルウィンドウが開閉された時に呼ばれるハンドラ
   *
   * @param {boolean} isOpen
   * @returns {void}
   */
  const onOpenChangeHandler = (isOpen: boolean): void => {
    state.setOpen(isOpen);
    setError("");
    setTitle("");
  };

  /**
   * タイトルが入力された時に呼ばれるハンドラ
   *
   * @param {ChangeEvent<HTMLInputElement>} e
   * @returns {void}
   */
  const titleOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const titleValue = e.target.value;
    setTitle(titleValue);
    const message = isValidTitle(titleValue);
    setError(message ? message : "");
  };

  /**
   * 名前が正しく入力されているかどうか判定
   *
   * @param {string} nameValue
   * @returns {boolean}
   */
  const isValidTitle = (titleValue: string) => {
    if (!titleValue) {
      return "タイトルが入力されていません。";
    }
    const regex = /[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|} ~¥]/g;
    if (titleValue.length > 20) {
      return "タイトルは20文字以内で入力してください。";
    } else if (regex.test(titleValue)) {
      return "タイトルに半角記号は使用できません。";
    } else {
      return "";
    }
  };

  return (
    <>
      <h3 className="mx-6 my-3 text-base font-bold">保存設定</h3>
      <div className="mx-6 my-2 grid grid-cols-2 gap-x-8 gap-y-4 text-base font-normal text-neutral-800 md:grid-cols-3">
        <Button
          className="text-xs sm:text-sm"
          onPress={state.open}>
          命式をブラウザに保存
        </Button>
        {/* HeroUI v3: ModalContent の render prop（onClose を受け取る形）は
            廃止され、Backdrop / Container / Dialog の組み立てになった。
            開閉は useOverlayState が持ち、閉じるのは state.close。 */}
        <Modal.Backdrop
          isOpen={state.isOpen}
          onOpenChange={onOpenChangeHandler}>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>命式をブラウザに保存</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                  <p>
                    {`現在表示中の命式をWebブラウザのデータベース（IndexedDB）に保存します。最大${MAX_LOCAL_STORAGE_ENTRY}件（ハードディスクの容量不足の場合は不可）まで保存することができます。`}
                  </p>
                  <p>
                    {"保存した命式は、"}
                    <Link
                      prefetch={false}
                      className="text-blue-600"
                      href="/list">
                      命式リスト
                    </Link>
                    {"ページから確認できます。"}
                  </p>
                {/* v3 の Input は素の input で label / size / variant
                    （underlined）を持たない。ラベルはアプリ既存の
                    .input-label-text を使う <label> に出す。 */}
                <label className="input-label-text" htmlFor="title">
                  タイトル（最大20文字）
                </label>
                <Input
                  id="title"
                  autoFocus={false}
                  maxLength={20}
                  placeholder=""
                  value={title}
                  onChange={e => titleOnChangeHandler(e)}
                />
                {error && (
                  <p className="chart-form-error">{error}</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="danger-soft"
                  onPress={state.close}>
                  キャンセル
                </Button>
                <Button
                  variant="primary"
                  onPress={() => onClickHandler(state.close)}>
                  保存
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </div>
    </>
  );
}
