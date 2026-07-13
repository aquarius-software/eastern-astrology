import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";
import { Combobox } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useChartContext } from "@/context/chartContext";

export default function LocationAutocompleteGoogle({
  digits,
  usedCount,
  setUsedCount,
  message,
  setMessage
}: {
  digits: number;
  usedCount: number;
  setUsedCount: React.Dispatch<React.SetStateAction<number>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  const {
    register,
    watch,
    clearErrors,
    setValue: rhfSetValue,
    formState: { errors }
  } = useFormContext();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue: upaSetValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    debounce: Number(process.env.NEXT_PUBLIC_DEBOUNCE_MILLISECONDS),
    cache: 24 * 60 * 60 * 7 // 7日間キャッシュを保持
  });
  const { setIsJapanese } = useChartContext();
  const [isComboboxOpen, setIsComboboxOpen] = useState<boolean>(false);
  const MAX_USED_COUNT = Number(process.env.NEXT_PUBLIC_MAX_USED_COUNT);

  useEffect(() => {
    if (data.length > 0) {
      setUsedCount(usedCount + 1);
      if (usedCount + 1 > MAX_USED_COUNT) {
        clearSuggestions();
        upaSetValue("");
        setMessage(
          "地域名の最大取得回数に達しました。"
        );
      }
      setIsComboboxOpen(true);
    }
  }, [data])

  /**
   * 地域名が選択された時に呼ばれるハンドラ
   * Google Maps Geocoding API使用
   *
   * @async
   * @param {string} description
   * @returns {Promise<void>}
   */
  const handleSelect = async (description: string): Promise<void> => {
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
      clearErrors("location");
      if (usedCount >= MAX_USED_COUNT) {
        setMessage(
          "地域名の最大取得回数に達しました。"
        );
      } else {
        setMessage("");
      }
      setIsComboboxOpen(false);
    } catch (error) {
      console.error(error);
      setMessage(
        "地域を取得できませんでした。しばらくしてからもう一度お試しください。"
      );
    }
  };

  // https://github.com/tailwindlabs/headlessui/discussions/1292
  const onInputFocus = (event) => {
    if (usedCount >= MAX_USED_COUNT) {
      event.target.value = '';
      event.target.disabled = true;
      setMessage(
        "地域名の最大取得回数に達しました。"
      );
    }
  }

  // https://www.reddit.com/r/reactjs/comments/14tko60/struggling_with_integrating_headlessui_combobox/
  return (
    <div className="chart-form-row">
      <div className="chart-form-box md:w-1/1">
        <label className="input-label-text" htmlFor="grid-first-name">
          地域名を直接入力
        </label>
        <p className="mb-3 text-base text-gray-500 dark:text-gray-300">
          <strong>地域名の一部を入力</strong>し、表示された候補の中から<strong>選択</strong>すると、緯度・経度が自動で入力されます。<strong>最大{MAX_USED_COUNT}回まで</strong>地域名を取得可能です。
        </p>
        <Combobox
          value={value}
          onChange={handleSelect}
          disabled={
            !ready ||
            watch("isHourUnknown")
          }>
          <div className="cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300">
            <Combobox.Input
              id="location"
              className={`input-text placeholder-gray-500 ${errors.location
                ? "mb-3 border-red-500"
                : "border-gray-200"
                }`}
              maxLength={100}
              onFocus={onInputFocus}
              autoFocus={false}
              placeholder={
                usedCount >= MAX_USED_COUNT
                  ? ""
                  : "地域名を入力し、候補から選択してください"
              }
              {...register("location", {
                maxLength: {
                  value: 100,
                  message: "地域名は100文字以内で入力してください"
                },
                onChange: e => {
                  upaSetValue(e.target.value);
                }
              })}
            />
            {errors.location && (
              <p className="chart-form-error">
                <ExclamationCircleIcon className="error-message-icon" />
                {errors.location.message?.toString()}
              </p>
            )}
            {isComboboxOpen && (
              <Combobox.Options static className="mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
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
            )}
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
