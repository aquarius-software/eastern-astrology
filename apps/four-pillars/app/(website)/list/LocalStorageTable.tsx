"use client";

import React, { Key, useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
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
const KEY_PREFIX = "fp-";
const DB_NAME = "four-pillars";
const STORE_NAME = "charts";
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
  const [slicedEntries, setSlicedEntries] = useState<LocalStorageItem[]>([]);
  const [numberOfEntries, setNumberOfEntries] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const allEntries = await getEntries(KEY_PREFIX);
        setNumberOfEntries(allEntries.length);
        setNumberOfPages(Math.ceil(allEntries.length / ROWS_PER_PAGE));
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
        } else if (Math.ceil(allEntries.length / ROWS_PER_PAGE) < currentPage) {
          setCurrentPage(currentPage - 1);
        }
      } catch (e) {
        console.error(e);
        setError("エラーが発生したため、命式データの読み込みができませんでした。");
      }
    })();
  }, [currentPage, numberOfEntries]);

  if (error) {
    return (
      <p className="mb-8 text-base font-bold text-red-500 dark:text-white">
        <ExclamationCircleIcon className="mb-1 mr-1 inline-block h-6 w-6"></ExclamationCircleIcon>
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
        return <Link size="sm" color="secondary" href={item.url}>{item.title}</Link>
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
            <CustomModal item={item} setNumberOfEntries={setNumberOfEntries}></CustomModal>
          </>
        );
      default:
        return "";
    }
  };

  return (
    <>
      <Table
        aria-label="Example table with custom cells"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={currentPage}
              total={numberOfPages}
              onChange={page => setCurrentPage(page)}
              isDisabled={numberOfEntries < 1}
            />
          </div>
        }>
        <TableHeader columns={columns}>
          {column => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={slicedEntries}
          emptyContent={"保存されている命式データはありません。"}>
          {entry => (
            <TableRow key={entry.key}>
              {columnKey => (
                <TableCell>{renderCell(entry, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
  setNumberOfEntries
}): JSX.Element => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
      setError("選択した命式データを削除できませんでした。");
    }
  };

  return (
    <>
      <Button variant="light" isIconOnly onPress={onOpen}>
        <TrashIcon className="h-6 w-6 cursor-pointer"></TrashIcon>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                命式データの削除
              </ModalHeader>
              <ModalBody>
                <p>
                  選択した命式データ『{item.title}』を削除しますか？
                </p>
                {error && (
                  <div>
                    <p className="chart-form-error">{error}</p>
                  </div>
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
                  onPress={() => {
                    deleteOnClickHandler(onClose, item.key, setNumberOfEntries);
                  }}>
                  削除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
    const filteredKeys = keys.filter(key =>
      key.includes(prefix)
    );
    const filteredValues = await Promise.all(filteredKeys.map(async key => {
      const item = await localForage.getItem(key) as LocalStorageItem;
      item.key = key;
      return item;
    }));
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
