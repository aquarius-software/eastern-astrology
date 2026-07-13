// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "@heroui/react";

export default function LoadingChart() {
  return (
    <div className="loading-container">
      <div className="loading-container">
        <Spinner color="success" />
        <p className="font-bold leading-10">
          命式を生成しています。<br />しばらくお待ちください。
        </p>
      </div>
      {/* <p>
        <FontAwesomeIcon
          icon={faYinYang}
          spin
          size="2xl"
          className="mr-2"
        />
        <span className="font-bold leading-10">
          命式を生成しています。<br />しばらくお待ちください。
        </span>
      </p> */}
    </div>
  );
}
