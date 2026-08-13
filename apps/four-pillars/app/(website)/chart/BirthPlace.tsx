import { useState, type JSX } from "react";
import CitySelection from "./CitySelection";
import GeoCode from "./GeoCode";
import LocationAutocomplete from "./AutocompleteGoogle";
import {
  useLoadScript,
  LoadScriptProps
} from "@react-google-maps/api";
import { Tabs, Card } from "@heroui/react";

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
  const [usedCount, setUsedCount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  return (
    <>
      <div className="chart-form-row">
        <div className="chart-form-box md:w-3/3">
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
        <Card className="max-w-full">
          <Card.Content className="overflow-hidden">
            <Tabs aria-label="Tabs">
              <Tabs.List>
                <Tabs.Tab id="selectArea">地域名を選択</Tabs.Tab>
                <Tabs.Tab id="inputArea">地域名を直接入力</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel id="selectArea" className="pb-0">
                <CitySelection digits={digits}></CitySelection>
              </Tabs.Panel>
              <Tabs.Panel id="inputArea" className="pb-0">
                {isLoaded && (
                  <LocationAutocomplete
                    digits={digits}
                    usedCount={usedCount}
                    setUsedCount={setUsedCount}
                    message={message}
                    setMessage={setMessage}></LocationAutocomplete>
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
