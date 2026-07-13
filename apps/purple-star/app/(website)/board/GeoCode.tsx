import { useFormContext } from "react-hook-form";

export default function GeoCode() {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext();
  const isHourUnknown = watch("isHourUnknown");

  return (
    <div className="board-form-row">
      <div className="board-form-box md:w-1/2">
        <label className="input-label-text" htmlFor="grid-last-name">
          緯度（自動入力）
        </label>
        <input
          className={`input-text ${!isHourUnknown && errors.latitude
            ? "mb-3 border-red-500"
            : "border-gray-200"
            }`}
          id="latitude"
          type="text"
          autoComplete="false"
          disabled={isHourUnknown}
          readOnly
          placeholder="自動入力"
          {...register("latitude")}
        />
        {!isHourUnknown && errors.latitude && (
          <p className="board-form-error">
            {errors.latitude.message!.toString()}
          </p>
        )}
      </div>
      <div className="board-form-box md:w-1/2">
        <label className="input-label-text" htmlFor="grid-last-name">
          経度（自動入力）
        </label>
        <input
          className={`input-text ${!isHourUnknown && errors.longitude
            ? "mb-3 border-red-500"
            : "border-gray-200"
            }`}
          id="longitude"
          type="text"
          autoComplete="false"
          disabled={isHourUnknown}
          readOnly
          placeholder="自動入力"
          {...register("longitude")}
        />
        {!isHourUnknown && errors.longitude && (
          <p className="board-form-error0">
            {errors.longitude.message!.toString()}
          </p>
        )}
      </div>
    </div>
  );
}
