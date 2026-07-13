import {
  useForm,
  UseFormSetValue,
  Controller
} from "react-hook-form";
import { FourPillarsData, OptionData } from "@/app/types";
import { Checkbox } from "@heroui/react";

export default function OptionCheckboxes({
  setValue
}: {
  result: FourPillarsData;
  setValue: UseFormSetValue<OptionData>;
}): React.ReactElement {
  const { getValues, control } = useForm({
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
      <h3 className="mx-6 my-3 font-bold text-base">表示設定</h3>
      <div className="mx-6 my-2 grid grid-cols-2 gap-x-8 gap-y-4 text-base font-normal text-neutral-800 md:grid-cols-3">
        {/* <Controller
          control={control}
          name="showRoots"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              onChange={e => {
                onChange(e);
                setValue("showRoots", getValues("showRoots"));
              }}
              isSelected={value}
            >
              通根
            </Checkbox>
          )}
        /> */}
        <Controller
          control={control}
          name="showChangingStars"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              onChange={e => {
                onChange(e);
                setValue("showChangingStars", getValues("showChangingStars"));
              }}
              isSelected={value}
            >
              通変星
            </Checkbox>
          )}
        />
        <Controller
          control={control}
          name="showTwelveLucks"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              onChange={e => {
                onChange(e);
                setValue("showTwelveLucks", getValues("showTwelveLucks"));
              }}
              isSelected={value}
            >
              十二運
            </Checkbox>
          )}
        />
        <Controller
          control={control}
          name="showHiddenStems"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              onChange={e => {
                onChange(e);
                setValue("showHiddenStems", getValues("showHiddenStems"));
              }}
              isSelected={value}
            >
              蔵干
            </Checkbox>
          )}
        />
        <Controller
          control={control}
          name="showWithColor"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              onChange={e => {
                onChange(e);
                setValue("showWithColor", getValues("showWithColor"));
              }}
              isSelected={value}
            >
              カラー表示
            </Checkbox>
          )}
        />
      </div>
    </div>
  );
}
