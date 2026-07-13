import { FourPillarsData } from "@/app/types";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

const imageStyle = {
  borderRadius: "0.5%"
};

export default function ChartImage({
  result,
  width,
  height
}: {
  result: FourPillarsData;
  width: number;
  height: number;
}): JSX.Element {
  const { imageUrl, nickname } = result;

  return (
    <div className="section-container">
      <div className="section-header flex items-center border-b dark:border-b-0">
        <PhotoIcon className="section-icon" />
        命式イメージ（ベータ版）
      </div>
      <div className="overflow-hidden p-4 dark:bg-gray-800">
        {imageUrl ? (
          <>
            <Image
              className="object-cover"
              src={imageUrl}
              alt={`生成AIによる${nickname ? `${nickname}さんの命式` : "命式"
                }イメージ画像`}
              width={width}
              height={height}
              style={imageStyle}></Image>
            <p className="block text-sm mt-4"><InformationCircleIcon className="section-icon mb-0.5" />命式イメージ作成機能はベータ版です。あくまでも命式のイメージを掴むための参考としてご覧ください。</p>
          </>
        ) : (
          <p className="text-base font-bold text-red-500">
            <ExclamationCircleIcon className="section-icon" />
            エラーが発生したため、命式イメージを生成できませんでした。
          </p>
        )}
      </div>
    </div>
  );
}
