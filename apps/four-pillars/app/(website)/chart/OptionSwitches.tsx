import { useForm, UseFormSetValue } from "react-hook-form";
import { FourPillarsData, OptionData } from "@/app/types";
import { Tooltip } from 'react-tooltip'

export default function OptionSwitches({
  setValue
}: {
  result: FourPillarsData;
  setValue: UseFormSetValue<OptionData>;
}): JSX.Element {
  const { register, getValues } = useForm({
    defaultValues: {
      showRoots: true,
      showChangingStars: true,
      showTwelveLucks: true,
      showHiddenStems: true,
      showWithColor: true
    }
  });

  return (
    <div className="mb-4">
      <h3 className="mx-6 my-3 font-bold">表示設定</h3>
      <div
        className="mx-6 my-2 grid grid-cols-2 gap-x-8 gap-y-4 font-normal text-neutral-800 md:grid-cols-3 text-base">
        <label
          htmlFor="showRootsButton"
          data-tooltip-id="showRootsTooltip" data-tooltip-content="天干の通根を表示"
          className="input-label-toggle">
          <input
            type="checkbox"
            id="showRootsButton"
            className="sr-only"
            {...register("showRoots", {
              onChange: () =>
                setValue(
                  "showRoots",
                  getValues("showRoots")
                )
            })}
          />
          <span className="slider mr-3 flex h-[26px] w-[50px] items-center rounded-full bg-[#CCCCCE] p-1 duration-200">
            <span className="dot h-[18px] w-[18px] rounded-full bg-white duration-200" />
          </span>
          <span className="input-toggle-text dark:text-gray-300 ">
            通根
          </span>
        </label>
        <Tooltip id="showRootsTooltip" />
        <label
          htmlFor="showChangingStarsButton"
          data-tooltip-id="showChangingStarsTooltip" data-tooltip-content="命式の通変星を表示"
          className="input-label-toggle">
          <input
            type="checkbox"
            id="showChangingStarsButton"
            className="sr-only"
            {...register("showChangingStars", {
              onChange: () =>
                setValue(
                  "showChangingStars",
                  getValues("showChangingStars")
                )
            })}
          />
          <span className="slider mr-3 flex h-[26px] w-[50px] items-center rounded-full bg-[#CCCCCE] p-1 duration-200">
            <span className="dot h-[18px] w-[18px] rounded-full bg-white duration-200" />
          </span>
          <span className="input-toggle-text dark:text-gray-300 ">
            通変星
          </span>
        </label>
        <Tooltip id="showChangingStarsTooltip" />
        <label
          htmlFor="showTwelveLucksButton"
          data-tooltip-id="showTwelveLucksTooltip" data-tooltip-content="命式の十二運を表示"
          className="input-label-toggle">
          <input
            type="checkbox"
            id="showTwelveLucksButton"
            className="sr-only"
            {...register("showTwelveLucks", {
              onChange: () =>
                setValue(
                  "showTwelveLucks",
                  getValues("showTwelveLucks")
                )
            })}
          />
          <span className="slider mr-3 flex h-[26px] w-[50px] items-center rounded-full bg-[#CCCCCE] p-1 duration-200">
            <span className="dot h-[18px] w-[18px] rounded-full bg-white duration-200" />
          </span>
          <span className="input-toggle-text dark:text-gray-300 ">
            十二運
          </span>
        </label>
        <Tooltip id="showTwelveLucksTooltip" />
        <label
          htmlFor="showHiddenStemsButton"
          data-tooltip-id="showHiddenStemsTooltip" data-tooltip-content="命式の蔵干を表示"
          className="input-label-toggle">
          <input
            type="checkbox"
            id="showHiddenStemsButton"
            className="sr-only"
            {...register("showHiddenStems", {
              onChange: () =>
                setValue(
                  "showHiddenStems",
                  getValues("showHiddenStems")
                )
            })}
          />
          <span className="slider mr-3 flex h-[26px] w-[50px] items-center rounded-full bg-[#CCCCCE] p-1 duration-200">
            <span className="dot h-[18px] w-[18px] rounded-full bg-white duration-200" />
          </span>
          <span className="input-toggle-text dark:text-gray-300 ">
            蔵干
          </span>
        </label>
        <Tooltip id="showHiddenStemsTooltip" />
        <label
          htmlFor="showWithColorButton"
          data-tooltip-id="showWithColorTooltip" data-tooltip-content="干支を色分けで表示"
          className="input-label-toggle">
          <input
            type="checkbox"
            id="showWithColorButton"
            className="sr-only"
            {...register("showWithColor", {
              onChange: () =>
                setValue(
                  "showWithColor",
                  getValues("showWithColor")
                )
            })}
          />
          <span className="slider mr-3 flex h-[26px] w-[50px] items-center rounded-full bg-[#CCCCCE] p-1 duration-200">
            <span className="dot h-[18px] w-[18px] rounded-full bg-white duration-200" />
          </span>
          <span className="input-toggle-text dark:text-gray-300 ">
            カラー表示
          </span>
        </label>
        <Tooltip id="showWithColorTooltip" />
      </div>
    </div>
  );
}
