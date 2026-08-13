"use client";

import { useState, useEffect, type JSX } from "react";
import { useForm, Controller } from "react-hook-form";
import { PurpleStarData, PurpleStarProps } from "@/app/types";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { Shippori_Mincho_B1 } from "next/font/google";
import PalaceView from "./PalaceView";
import CentralView from "./CentralView";
import {
  BRANCHES_MINI,
  PALACES_MINI,
  PALACE_BRANCHES,
  Palace
} from "types";
import {
  Checkbox,
  Switch,
  Select,
  ListBox
} from "@heroui/react";
import OptionStorage from "./OptionStorage";
import { getItemsFromArrayCycle } from "utils";
import { useBoardContext } from "@/context/boardContext";

const ship = Shippori_Mincho_B1({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-ship"
});

export default function ResultBoard({
  result
}: PurpleStarProps): JSX.Element {
  const { nickname, palaces, asianAge }: PurpleStarData = result;
  const mainPalace = palaces.find(
    (palace: Palace) => palace.isMainPalace
  );
  const mainBranchIndex = BRANCHES_MINI.findIndex(
    branch => branch === mainPalace!.branch
  );
  const branches = getItemsFromArrayCycle(
    BRANCHES_MINI,
    mainBranchIndex,
    12,
    true
  );
  const luckOptions = branches.map((branch, i) => {
    const palace = palaces.find(
      (palace: Palace) => palace.branch === branch
    );
    return {
      label: `${palace?.startingAge}〜${palace?.endingAge}歳（${branch}）`,
      value: (i + mainBranchIndex) % 12,
      stemIndex: palace?.stemIndex,
      startingAge: palace?.startingAge,
      endingAge: palace?.endingAge
    };
  });
  const {
    setCurrentPalace,
    showChildStar,
    setShowChildStar,
    showSelfChildStar,
    setShowSelfChildStar,
    showDiagonalChildStar,
    setShowDiagonalChildStar,
    showMainChildStar,
    setShowMainChildStar
  } = useBoardContext();
  const { watch, setValue, getValues, control } = useForm({
    defaultValues: {
      showWithColor: true,
      activeMode: false,
      activePalace: null,
      showChildStar: true,
      showSelfChildStar: false,
      showDiagonalChildStar: false,
      showMainChildStar: false
    }
  });
  const sortedPalaces = [...palaces].sort((a, b) =>
    a.boardPosition > b.boardPosition ? 1 : -1
  );
  const activeMode = watch("activeMode");
  const [activePalace, setActivePalace] = useState<number>(0);
  const [activeStemIndex, setActiveStemIndex] = useState<number>(-1);
  const showWithColor = watch("showWithColor");

  useEffect(() => {
    setCurrentPalace(mainPalace?.boardPosition as number);
  }, [activeMode]);

  if (activeMode) {
    // 活盤モードの場合は活盤宮を設定
    const branches = getItemsFromArrayCycle(
      BRANCHES_MINI,
      activePalace,
      12,
      true
    );
    const activeBranches = branches.map((branch, i) => {
      return {
        branch,
        palaceName: PALACES_MINI[i]
      };
    });
    palaces.forEach((palace, i) => {
      const activeBranch = activeBranches.find(
        activeBranch => palace.branch === activeBranch.branch
      );
      palace.activeName = activeBranch?.palaceName;
    });
  }

  return (
    <>
      <div className="section-container">
        <div className="section-header flex items-center border-b dark:border-b-0">
          <TableCellsIcon className="section-icon" />
          {nickname ? `${nickname}さんの命盤` : "命盤"}
          {activeMode ? "（活盤モード）" : ""}
        </div>
        <div
          className={`grid grid-cols-[1fr_1fr_1fr_1fr] place-content-center gap-x-2 gap-y-2 bg-white px-1 py-1 text-base text-neutral-600 sm:gap-x-2 sm:gap-y-2 sm:px-1 sm:py-1 md:grid-cols-[1fr_1fr_1fr_1fr] dark:bg-gray-800 ${ship.variable}`}>
          {sortedPalaces.map((palace, i) => (
            <PalaceView
              key={i}
              palace={palace}
              mainPalacePosition={mainPalace?.boardPosition || 0}
              asianAge={asianAge}
              showWithColor={showWithColor}
              isActiveMode={activeMode}
              activeStemIndex={activeStemIndex}></PalaceView>
          ))}
          <CentralView></CentralView>
        </div>
        <div className="flex flex-col gap-y-6 bg-gray-50 px-4 py-4 text-sm md:text-base">
          <div>
            <h3 className="mb-2 font-bold">活盤設定</h3>
            <div className="grid grid-cols-1 content-start font-normal text-neutral-800 md:grid-cols-3">
              <Controller
                control={control}
                name="activeMode"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    isSelected={value}
                    onChange={e => {
                      onChange(e);
                      if (!value) {
                        const mainPalaceBranch = mainPalace?.branch;
                        const palaceBranch = PALACE_BRANCHES.find(
                          palaceBranch =>
                            palaceBranch.value === mainPalaceBranch
                        );
                        setActivePalace(
                          palaceBranch?.index as number
                        );
                        // setCurrentPalace(palace.boardPosition);
                      }
                    }}>
                    <Switch.Content>
                      {/* Content が実際の操作対象（label＋input）で、Control は
                          装飾用の span。Control を Content の外に置くと
                          トグル部分をクリックしても反応しない。 */}
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      活盤モード
                    </Switch.Content>
                  </Switch>
                )}
              />
              {activeMode && (
                <Controller
                  control={control}
                  name="activePalace"
                  render={({ field: { onChange, value } }) => (
                    /* HeroUI v3: Select は react-aria ベースになり、
                       DOM の change イベントではなく onSelectionChange(Key)
                       を受ける。選択肢は SelectItem ではなく
                       Select.Popover 内の ListBox.Item で与える。
                       label prop も廃止のため <label> を外に出した。 */
                    <Select
                      className="max-w-xs"
                      selectedKey={value != null ? String(value) : null}
                      onSelectionChange={key => {
                        onChange(key);
                        const activePalaceIndex = Number(key);
                        setActivePalace(activePalaceIndex);
                        const activeBranch =
                          BRANCHES_MINI[activePalaceIndex];
                        const activePalace = palaces.find(palace => {
                          return palace.branch === activeBranch;
                        });
                        setCurrentPalace(
                          activePalace?.boardPosition as number
                        );
                        setActiveStemIndex(
                          activePalace?.stemIndex as number
                        );
                      }}>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {luckOptions.map(palace => (
                            <ListBox.Item
                              key={palace.value}
                              id={String(palace.value)}>
                              {palace.label}
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  )}
                />
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-bold">四化星設定</h3>
            <div className="grid grid-cols-1 content-start gap-y-4 font-normal text-neutral-800 md:grid-cols-3">
              <Controller
                control={control}
                name="showChildStar"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    isSelected={value}
                    onChange={e => {
                      onChange(e);
                      setShowChildStar(!showChildStar);
                    }}>
                    <Switch.Content>
                      {/* Content が実際の操作対象（label＋input）で、Control は
                          装飾用の span。Control を Content の外に置くと
                          トグル部分をクリックしても反応しない。 */}
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      生年四化
                    </Switch.Content>
                  </Switch>
                )}
              />
              <Controller
                control={control}
                name="showSelfChildStar"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    isSelected={value}
                    onChange={e => {
                      onChange(e);
                      setShowSelfChildStar(!showSelfChildStar);
                    }}>
                    <Switch.Content>
                      {/* Content が実際の操作対象（label＋input）で、Control は
                          装飾用の span。Control を Content の外に置くと
                          トグル部分をクリックしても反応しない。 */}
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      自化四化
                    </Switch.Content>
                  </Switch>
                )}
              />
              <Controller
                control={control}
                name="showDiagonalChildStar"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    isSelected={value}
                    onChange={e => {
                      onChange(e);
                      setShowDiagonalChildStar(
                        !showDiagonalChildStar
                      );
                    }}>
                    <Switch.Content>
                      {/* Content が実際の操作対象（label＋input）で、Control は
                          装飾用の span。Control を Content の外に置くと
                          トグル部分をクリックしても反応しない。 */}
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      流出四化
                    </Switch.Content>
                  </Switch>
                )}
              />
              <Controller
                control={control}
                name="showMainChildStar"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    isSelected={value}
                    onChange={e => {
                      onChange(e);
                      setShowMainChildStar(!showMainChildStar);
                    }}>
                    <Switch.Content>
                      {/* Content が実際の操作対象（label＋input）で、Control は
                          装飾用の span。Control を Content の外に置くと
                          トグル部分をクリックしても反応しない。 */}
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      命宮四化
                    </Switch.Content>
                  </Switch>
                )}
              />
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-bold">表示設定</h3>
            <div className="grid grid-cols-1 font-normal text-neutral-800 md:grid-cols-2">
              <Controller
                control={control}
                name="showWithColor"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    onChange={e => {
                      onChange(e);
                      setValue(
                        "showWithColor",
                        getValues("showWithColor")
                      );
                    }}
                    isSelected={value}>
                    <Checkbox.Content>
                      {/* Content が実際の操作対象（label＋input）で、Control は
                          装飾用の span。Control を Content の外に置くと
                          トグル部分をクリックしても反応しない。 */}
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <span className="text-sm md:text-base">
                      カラー表示
                    </span>
                    </Checkbox.Content>
                  </Checkbox>
                )}
              />
            </div>
          </div>
          <OptionStorage result={result}></OptionStorage>
          <div>
            <h3 className="mb-2 font-bold">背景色</h3>
            <div>
              <span className="mr-4">
                三合宮
                <span className="ml-1 inline-block w-4 bg-blue-100">
                  &nbsp;
                </span>
              </span>
              <span className="mr-4">
                対宮
                <span className="ml-1 inline-block w-4 bg-teal-200">
                  &nbsp;
                </span>
              </span>
              <span className="mr-4">
                その他の宮
                <span className="ml-1 inline-block w-4 bg-stone-200">
                  &nbsp;
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
