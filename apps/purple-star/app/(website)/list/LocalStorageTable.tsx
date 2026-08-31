"use client";

import React, { Key, useState, useEffect, type JSX } from "react";
import {
  Table,
  Modal,
  useOverlayState,
  Button,
  Pagination,
  Link
} from "@heroui/react";
import {
  TrashIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import type { LocalStorageItem } from "types";
import localForage from "localforage";

const ROWS_PER_PAGE = 5;
const KEY_PREFIX = "ps-";
const DB_NAME = "purple-star";
const STORE_NAME = "boards";
const columns = [
  { name: "タイトル", uid: "title" },
  { name: "作成日", uid: "createdAt" },
  { name: "削除", uid: "delete" }
];

/**
 * LocalStorageTableコンポーネント
 *
 * @returns
 */
export default function LocalStorageTable() {
  const [slicedEntries, setSlicedEntries] = useState<
    LocalStorageItem[]
  >([]);
  const [numberOfEntries, setNumberOfEntries] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const allEntries = await getEntries(KEY_PREFIX);
        setNumberOfEntries(allEntries.length);
        setNumberOfPages(
          Math.ceil(allEntries.length / ROWS_PER_PAGE)
        );
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        const end = start + ROWS_PER_PAGE;
        if (allEntries && allEntries.length > 0) {
          const slicedEntries = allEntries.slice(start, end);
          setSlicedEntries(slicedEntries);
        } else {
          setSlicedEntries([]);
        }
        if (allEntries.length === 0) {
          setCurrentPage(1);
        } else if (
          Math.ceil(allEntries.length / ROWS_PER_PAGE) < currentPage
        ) {
          setCurrentPage(currentPage - 1);
        }
      } catch (e) {
        console.error(e);
        setError(
          "エラーが発生したため、命盤データの読み込みができませんでした。"
        );
      }
    })();
  }, [currentPage, numberOfEntries]);

  if (error) {
    return (
      <p className="mb-8 text-base font-bold text-red-500 dark:text-white">
        <ExclamationCircleIcon className="mr-1 mb-1 inline-block h-6 w-6"></ExclamationCircleIcon>
        {error}
      </p>
    );
  }

  /**
   * テーブルのセルを描画する関数
   *
   * @param item
   * @param columnKey
   * @returns
   */
  const renderCell = (item: LocalStorageItem, columnKey: Key) => {
    switch (columnKey) {
      case "title":
        // v3 の Link は色の prop を持たず、既定の --link トークンが
        // ほぼ黒（lab 8.3%）でリンクに見えない。アプリ既存の規則
        // （TableOfContents・保存モーダル）に合わせて青を当てる。
        return (
          <Link
            href={item.url}
            className="text-blue-600 hover:text-blue-900 hover:no-underline data-hovered:no-underline">
            {item.title}
          </Link>
        );
      case "createdAt":
        const createdAt = new Date(item.createdAt);
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "short",
          day: "numeric"
        };
        return createdAt.toLocaleDateString("ja-JP", options);
      case "delete":
        return (
          <>
            <CustomModal
              item={item}
              setNumberOfEntries={setNumberOfEntries}></CustomModal>
          </>
        );
      default:
        return "";
    }
  };

  return (
    <>
      {/* HeroUI v3 の Table は react-aria ベース。columns / items +
          関数 children の形は維持されるが、collection の要素には key では
          なく id が要る。bottomContent は無くなったのでページネーションは
          テーブルの外へ出した。emptyContent は renderEmptyState に変更。
          align は v2 独自の prop で、元の条件（uid === "actions"）は
          columns のどれにも一致していなかったため落とした。 */}
      {/* Table ルートは見た目用の <div> でしかなく、react-aria の実体は
          Table.Content。これを挟まないと Table.Column が
          「cannot be rendered outside a collection」で落ちる。
          aria-label は実体側（Table.Content）に付ける。 */}
      <Table>
        <Table.Content aria-label="保存済み命盤の一覧">
          {/* react-aria は行の見出しとなる列を要求する（無いと
              "A table must have at least one Column with the isRowHeader
              prop set to true" の実行時エラーになる）。 */}
          <Table.Header columns={columns}>
            {column => (
              <Table.Column
                key={column.uid}
                id={column.uid}
                isRowHeader={column.uid === "title"}>
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body
            items={slicedEntries}
            renderEmptyState={() => (
              // 素の文字列を返すと左寄せ・余白なしで、背景も
              // データ行の白にならない。要素で包んで揃える。
              // 角丸は table__body がセルに当てている式と同じものを使う
              // （この div の白背景が td の角丸を塗り潰してしまうため）。
              <div className="rounded-[min(32px,var(--radius-2xl))] bg-white p-4 text-center">
                保存されている命盤データはありません。
              </div>
            )}>
            {entry => (
              <Table.Row
                key={entry.key}
                id={entry.key}
                columns={columns}>
                {/* v2 の TableRow は columnKey(Key) を渡していたが、
                    react-aria の Row は column オブジェクトを渡す。 */}
                {column => (
                  <Table.Cell>{renderCell(entry, column.uid)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table>
      {/* v3 の Pagination は単一コンポーネントではなく組み立て。
          v2 の isCompact / showShadow / color に相当するものは無い。
          省略表示も無くなるため、全ページ番号を並べている
          （1ページ ROWS_PER_PAGE 件・最大100件なので現実的な個数に収まる）。 */}
      {/* ルートは w-full + justify-between。Summary（件数表示）を置いて
          いないので、唯一の子である Content が左端に寄る。sm 未満では
          さらに self-start が効く。両方を打ち消して中央に置く。
          ルートが w-full なので外側での justify-center は効かない。 */}
      <div className="mt-4">
        <Pagination className="justify-center">
          {/* v2 のグレー帯に寄せる。帯を敷くと既定の active（--default=グレー）
              では選択位置が埋もれるので、active はアプリの青に上書きする。 */}
          <Pagination.Content className="self-center rounded-lg bg-default p-1">
            <Pagination.Item>
              {/* アイコンだけにするとアクセシブル名が無くなるため
                  aria-label を明示する。 */}
              <Pagination.Previous
                aria-label="前のページ"
                isDisabled={numberOfEntries < 1 || currentPage <= 1}
                onPress={() =>
                  setCurrentPage(page => Math.max(1, page - 1))
                }>
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>
            {Array.from(
              { length: numberOfPages },
              (_, i) => i + 1
            ).map(page => (
              <Pagination.Item key={page}>
                <Pagination.Link
                  className="data-active:bg-blue-600 data-active:text-white"
                  isActive={page === currentPage}
                  isDisabled={numberOfEntries < 1}
                  onPress={() => setCurrentPage(page)}>
                  {page}
                </Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next
                aria-label="次のページ"
                isDisabled={
                  numberOfEntries < 1 || currentPage >= numberOfPages
                }
                onPress={() =>
                  setCurrentPage(page =>
                    Math.min(numberOfPages, page + 1)
                  )
                }>
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>
      {/* currentPage:{currentPage} / numberOfPages:{numberOfPages} / numberOfEntries:{numberOfEntries} */}
    </>
  );
}

/**
 * 削除確認用モーダルウィンドウ
 * https://stackoverflow.com/questions/65988633/chakra-ui-using-multiple-models-in-a-single-component
 *
 * @param item
 * @param setTime
 * @returns
 */
const CustomModal = ({
  item,
  setNumberOfEntries
}: {
  item: LocalStorageItem;
  setNumberOfEntries;
}): JSX.Element => {
  // HeroUI v3: useDisclosure は廃止。useOverlayState に置き換わった。
  const state = useOverlayState();
  const [error, setError] = useState("");

  /**
   * 削除ボタンが押された時のハンドラ
   *
   * @param onClose
   * @param item
   */
  const deleteOnClickHandler = async (
    onClose: () => void,
    key: string,
    setNumberOfEntries: (num: number) => void
  ) => {
    try {
      localForage.config({
        name: DB_NAME,
        storeName: STORE_NAME
      });
      await localForage.removeItem(key);
      const keys = await localForage.keys();
      const filteredKeys = keys.filter(key =>
        key.includes(KEY_PREFIX)
      );
      setNumberOfEntries(filteredKeys.length);
      onClose();
    } catch (error) {
      console.error(error);
      setError("選択した命盤データを削除できませんでした。");
    }
  };

  return (
    <>
      <Button variant="ghost" isIconOnly onPress={state.open}>
        <TrashIcon className="h-6 w-6 cursor-pointer"></TrashIcon>
      </Button>
      {/* v3 は ModalContent の render prop が廃止され、
          Backdrop / Container / Dialog の組み立てになった。 */}
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>命盤データの削除</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
                <p>
                  選択した命盤データ『{item.title}』を削除しますか？
                </p>
                {error && (
                  <div>
                    <p className="chart-form-error">{error}</p>
                  </div>
                )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger-soft" onPress={state.close}>
                キャンセル
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  deleteOnClickHandler(
                    state.close,
                    item.key,
                    setNumberOfEntries
                  );
                }}>
                削除
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};

/**
 * IndexedDBから指定した文字列で始まるエントリを取得してソートするローカル関数
 *
 * @returns
 */
const getEntries = async (prefix: string) => {
  try {
    localForage.config({
      name: DB_NAME,
      storeName: STORE_NAME
    });
    const keys = await localForage.keys();
    const filteredKeys = keys.filter(key => key.includes(prefix));
    const filteredValues = await Promise.all(
      filteredKeys.map(async key => {
        const item = (await localForage.getItem(
          key
        )) as LocalStorageItem;
        item.key = key;
        return item;
      })
    );
    filteredValues.sort((a, b) => {
      const aKey = a.createdAt;
      const bKey = b.createdAt;
      if (aKey < bKey) {
        return 1;
      }
      if (aKey > bKey) {
        return -1;
      }
      return 0;
    });
    return filteredValues;
  } catch (error) {
    console.log(error);
    return [];
  }
};
