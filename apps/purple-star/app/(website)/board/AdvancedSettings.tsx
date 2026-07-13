import SchoolSelect from "./SchoolSelect";

export default function AdvancedSettings(): JSX.Element {
  return (
    <>
      <div className="board-form-row">
        <div className="board-form-box md:w-3/3">
          <h3 className="input-label-header">詳細設定</h3>
          <SchoolSelect></SchoolSelect>
        </div>
      </div>
    </>
  );
}
