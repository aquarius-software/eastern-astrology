import CitySelection from "./CitySelection";
import GeoCode from "./GeoCode";
import LocationAutocomplete from "./LocationAutocomplete";
import {
  useLoadScript,
  LoadScriptProps
} from "@react-google-maps/api";
import { Tabs, Card } from "@heroui/react";

import type { JSX } from "react";

const libraries: LoadScriptProps["libraries"] = ["places"];

export default function BirthPlace({
  digits
}: {
  digits: number;
}): JSX.Element {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env
      .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries
  });

  return (
    <>
      <div className="board-form-row">
        <div className="board-form-box md:w-3/3">
          <h3 className="input-label-header">出生地</h3>
          <p className="text-base text-gray-500 dark:text-gray-300">
            出生地の入力方法には、プルダウンメニューから
            <span className="font-bold">地域名を選択</span>
            する方法と、
            <span className="font-bold">地域名を直接入力</span>
            する方法の二つがあります。<strong>詳細な出生地</strong>
            を入力したい場合、もしくは
            <strong>出生地が海外の場合</strong>
            は、地域名を直接入力してください。
          </p>
        </div>
      </div>
      <div className="mb-8 w-full">
        {/* HeroUI v3: CardBody → Card.Content。Card の shadow / radius は
            廃止され、見た目はテーマ側で決まる。
            Tabs は react-aria ベースになり、見出し(Tabs.Tab)と中身
            (Tabs.Panel)が分離した。v2 の key + title は id + 子要素になる。
            v2 の fullWidth / size も廃止。 */}
        <Card className="max-w-full rounded-lg shadow-md inset-shadow-xs">
          <Card.Content className="overflow-hidden">
            <Tabs aria-label="Tabs">
              {/* Tabs.ListContainer がタブ帯のグレー背景（bg-default）を
                  描画する。これが無いと帯が白いままで、白いピル
                  （Indicator の bg-segment）との対比が付かず選択状態が
                  分かりにくい。
                  Tabs.Indicator は各 Tab の内側に置くと選択中のタブに
                  だけ出る。 */}
              {/* radius は3箇所（container / tab / indicator）から来る。
                  container は border-radius: calc(var(--radius) * 2.5)、
                  tab と indicator は rounded-3xl。v2 に寄せるため
                  utilities レイヤーのクラスで小さく上書きする。 */}
              <Tabs.ListContainer className="rounded-lg">
                <Tabs.List>
                  <Tabs.Tab
                    id="city-selection"
                    className="rounded-md">
                    <Tabs.Indicator className="rounded-md" />
                    地域名を選択
                  </Tabs.Tab>
                  <Tabs.Tab id="auto-complete" className="rounded-md">
                    <Tabs.Indicator className="rounded-md" />
                    地域名を入力
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="city-selection">
                <CitySelection digits={digits}></CitySelection>
              </Tabs.Panel>
              <Tabs.Panel id="auto-complete">
                {isLoaded && (
                  <LocationAutocomplete
                    digits={digits}></LocationAutocomplete>
                )}
              </Tabs.Panel>
            </Tabs>
          </Card.Content>
        </Card>
      </div>
      <GeoCode></GeoCode>
    </>
  );
}
