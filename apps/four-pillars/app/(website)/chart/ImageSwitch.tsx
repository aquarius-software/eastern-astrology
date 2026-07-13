import { useFormContext, Controller } from "react-hook-form";
import { Switch } from "@heroui/react";

export default function Location(): JSX.Element {
  const { register, control } = useFormContext();

  return (
    <>
      <div className="chart-form-row">
        <div className="chart-form-box md:w-1/1">
          <label
            className="input-label-text"
            htmlFor="grid-first-name">
            命式イメージ生成（ベータ版）
          </label>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-300">
            AIにより命式のイメージ画像を生成します。通常の命式作成より少し時間がかかります。
          </p>
          <Controller
            control={control}
            name="createImage"
            render={({ field }) => (
              <Switch
                {...field}
                className="mt-3"
                isSelected={field.value}>
                命式イメージを生成
              </Switch>
            )}
          />
        </div>
      </div>
    </>
  );
}
