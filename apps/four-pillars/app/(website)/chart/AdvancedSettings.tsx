import ImageSwitch from "./ImageSwitch";
import DivisionMethod from "./DivisionMethod";
import DayStemMethod from "./DayStemMethod";

export default function AdvancedSettings(): JSX.Element {
  return (
    <>
      <div className="chart-form-row">
        <div className="chart-form-box md:w-3/3">
          <h3 className="input-label-header">詳細設定</h3>
          <p className="text-base text-gray-500 dark:text-gray-300 mb-6">
            以下の設定は、<strong>節入り日前後</strong>や、<strong>日付が変わる前後の時間帯</strong>に生まれた方向けの設定です。ほとんどの場合、設定を変更する必要はありません。
          </p>
          <DivisionMethod></DivisionMethod>
          <DayStemMethod></DayStemMethod>
          {/* <ImageSwitch></ImageSwitch> */}
        </div>
      </div>
    </>
  );
}
