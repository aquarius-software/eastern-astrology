import { useState } from "react";
import { useFormContext } from "react-hook-form";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";
import { Combobox } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useBoardContext } from "@/context/boardContext";

export default function LocationAutocomplete({
  digits
}: {
  digits: number;
}): JSX.Element {
  const {
    register,
    watch,
    setValue: rhfSetValue,
    formState: { errors }
  } = useFormContext();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue: upaSetValue
  } = usePlacesAutocomplete({
    debounce: Number(process.env.NEXT_PUBLIC_DEBOUNCE_MILLISECONDS),
    cache: 24 * 60 * 60 * 7 // 7日間キャッシュを保持
  });
  const [message, setMessage] = useState<string>("");
  const [usedCount, setUsedCount] = useState<number>(0);
  const { setIsJapanese } = useBoardContext();
  const MAX_USED_COUNT = Number(process.env.NEXT_PUBLIC_MAX_USED_COUNT);

  /**
   * 地域名が選択された時に呼ばれるハンドラ
   *
   * @async
   * @param {string} description
   * @returns {Promise<void>}
   */
  const handleSelect = async (description: string): Promise<void> => {
    setUsedCount(usedCount + 1);
    upaSetValue(description, false);
    try {
      const results = await getGeocode({ address: description });
      const result = results[0];
      const { lat, lng } = getLatLng(result);
      const latitude = Number(lat).toFixed(digits);
      const longitude = Number(lng).toFixed(digits);
      rhfSetValue("latitude", latitude, {
        shouldValidate: true
      });
      rhfSetValue("longitude", longitude, {
        shouldValidate: true
      });
      for (let i = 0; i < result.address_components.length; i++) {
        const addressComponent = result.address_components[i];
        for (let j = 0; j < addressComponent.types.length; j++) {
          if (
            addressComponent.types[j] === "country" &&
            addressComponent.short_name !== "JP"
          ) {
            // 海外の場合
            setIsJapanese(false);
            break;
          } else {
            setIsJapanese(true);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "地域を取得できませんでした。しばらくしてからもう一度お試しください。"
      );
    }
  };

  // https://www.reddit.com/r/reactjs/comments/14tko60/struggling_with_integrating_headlessui_combobox/
  return (
    <div className="board-form-row">
      <div className="board-form-box md:w-1/1">
        <label className="input-label-text" htmlFor="grid-first-name">
          地域名を直接入力
        </label>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-300">
          地域名の一部を入力し、表示された候補の中から地域を選択します。緯度・経度が自動で入力されます。最大3回まで入力可能です。
        </p>
        <Combobox
          value={value}
          onChange={handleSelect}
          disabled={
            !ready ||
            watch("isHourUnknown") ||
            usedCount > MAX_USED_COUNT
          }>
          <div className="cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300">
            <Combobox.Input
              id="location"
              className={`input-text placeholder-gray-500 ${errors.location
                ? "mb-3 border-red-500"
                : "border-gray-200"
                }`}
              maxLength={100}
              placeholder={
                usedCount < MAX_USED_COUNT
                  ? "地域名を入力し、候補から選択してください"
                  : "地域名の最大取得回数に達しました。"
              }
              {...register("location", {
                maxLength: {
                  value: 100,
                  message: "地域名は100文字以内で入力してください"
                },
                onChange: e => upaSetValue(e.target.value)
              })}
            />
            {errors.location && (
              <p className="board-form-error">
                <ExclamationCircleIcon className="error-message-icon" />
                {errors.location.message?.toString()}
              </p>
            )}
            <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
              {status === "OK" &&
                data.map(({ place_id, description }, i) => (
                  <Combobox.Option
                    className={({ active }) =>
                      `border-x border-t ${i === 0 && "rounded-t"} ${i === data.length - 1 && "rounded-b border-b"
                      } relative cursor-default select-none py-2 pl-4 pr-4 ${active
                        ? "bg-teal-600 text-white"
                        : "text-gray-900"
                      }`
                    }
                    key={place_id}
                    value={description}>
                    {description}
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </div>
        </Combobox>
        {message && (
          <p className="mt-3 text-sm font-bold text-red-500">
            <ExclamationCircleIcon className="error-message-icon" />
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
