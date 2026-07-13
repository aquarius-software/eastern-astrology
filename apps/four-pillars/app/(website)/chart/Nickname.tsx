import { useFormContext } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function Nickname(): JSX.Element {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  /**
   * 名前が正しく入力されているかどうか判定
   *
   * @param {string} nameValue
   * @returns {boolean}
   */
  const isValidName = (nameValue: string) => {
    if (!nameValue) {
      return true;
    }
    const regex = /[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~¥]/g
    if (nameValue.length > 10) {
      return "名前は10文字以内で入力してください";
    } else if (regex.test(nameValue)) {
      return "名前に半角記号は使用できません";
    } else {
      return true;
    }
  }

  return (
    <>
      <div className="chart-form-row">
        <div className="chart-form-box md:w-3/3">
          <h3 className="input-label-header">名前（ニックネーム）</h3>
          <p className="mb-4 text-base text-gray-500 dark:text-gray-300">
            <strong>入力は任意</strong>です。10文字以内で入力可能です。
          </p>
          <input
            className={`md:w-1/2 input-text placeholder-gray-500 ${errors.nickname
              ? "mb-3 border-red-500 focus:border-red-500"
              : "border-gray-200"
              }`}
            id="nickname"
            type="text"
            maxLength={10}
            autoComplete="false"
            autoFocus={false}
            placeholder=""
            {...register("nickname", {
              validate: isValidName
            })}
          />
          {errors.nickname && (
            <p className="chart-form-error">
              <ExclamationCircleIcon className="error-message-icon" />{errors.nickname.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
