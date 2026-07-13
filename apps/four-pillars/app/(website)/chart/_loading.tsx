import { LoadingIcon } from "ui";

export default function loading() {
  return (
    <div className="loading-container">
      <p>
        <LoadingIcon></LoadingIcon>
        <span className="font-bold">
          ページを読み込んでいます。<br />しばらくお待ちください。
        </span>
      </p>
    </div>
  );
}
