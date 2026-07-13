import { PurpleStarData } from "@/app/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure
} from "@heroui/react";
import { ChangeEvent, useState, useEffect } from "react";
import Link from "next/link";
import { generateUrlFromResult } from "@/utils/url";
import { usePathname } from "next/navigation";
import localForage from "localforage";
import { LocalStorageItem } from "types";
import { v4 as uuidv4 } from "uuid";

const MAX_LOCAL_STORAGE_ENTRY = 100;
const KEY_PREFIX = "ps-";
const DB_NAME = "purple-star";
const STORE_NAME = "boards";

export default function OptionStorage({
  result
}: {
  result: PurpleStarData;
}): JSX.Element {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { nickname } = result;
  const defaultTitle = nickname ? `${nickname}さんの命盤` : "";
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
   * 命盤入力データからオブジェクトを生成
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
   * @param {(boolean) => void} onOpenChange
   * @returns {void}
   */
  const onOpenChangeHandler = (
    onOpenChange: (isOpen: boolean) => void
  ) => {
    onOpenChange(isOpen);
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
    <div>
      <h3 className="mb-2 font-bold">保存設定</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-base font-normal text-neutral-800 md:grid-cols-3">
        <Button className="text-xs sm:text-sm" onPress={onOpen}>
          命盤をブラウザに保存
        </Button>
        <Modal
          placement="center"
          isOpen={isOpen}
          onOpenChange={() => onOpenChangeHandler(onOpenChange)}>
          <ModalContent>
            {onClose => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  命盤をブラウザに保存
                </ModalHeader>
                <ModalBody>
                  <p>
                    {`現在表示中の命盤をWebブラウザのデータベース（IndexedDB）に保存します。最大${MAX_LOCAL_STORAGE_ENTRY}件（ハードディスクの容量不足の場合は不可）まで保存することができます。`}
                  </p>
                  <p>
                    {"保存した命盤は、"}
                    <Link className="text-blue-600" href="/list" prefetch={false}>
                      命盤リスト
                    </Link>
                    {"ページから確認できます。"}
                  </p>
                  <Input
                    id="title"
                    autoFocus={false}
                    maxLength={20}
                    size="lg"
                    label="タイトル（最大20文字）"
                    placeholder=""
                    variant="underlined"
                    value={title}
                    onChange={e => titleOnChangeHandler(e)}
                  />
                  {error && (
                    <p className="chart-form-error">{error}</p>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}>
                    キャンセル
                  </Button>
                  <Button
                    color="primary"
                    onPress={e => onClickHandler(onClose)}>
                    保存
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
