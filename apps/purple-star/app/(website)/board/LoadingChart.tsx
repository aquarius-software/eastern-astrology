import { Spinner } from "@heroui/react";

export default function LoadingChart() {
  return (
    <div className="loading-container">
      <div className="loading-container">
        <Spinner color="primary" />
        <p className="leading-10 font-bold">
          命盤を生成しています。
          <br />
          しばらくお待ちください。
        </p>
      </div>
    </div>
  );
}
