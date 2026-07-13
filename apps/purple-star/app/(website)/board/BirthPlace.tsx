import CitySelection from "./CitySelection";
import GeoCode from "./GeoCode";
import LocationAutocomplete from "./LocationAutocomplete";
import {
  useLoadScript,
  LoadScriptProps
} from "@react-google-maps/api";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

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
            する方法の二つがあります。<strong>詳細な出生地</strong>を入力したい場合、もしくは<strong>出生地が海外の場合</strong>は、地域名を直接入力してください。
          </p>
        </div>
      </div>
      <div className="w-full mb-8">
        <Card className="max-w-full" shadow="sm" radius="sm">
          <CardBody className="overflow-hidden">
            <Tabs aria-label="Tabs" fullWidth size="md">
              <Tab key="city-selection" title="地域名を選択">
                <CitySelection digits={digits}></CitySelection>
              </Tab>
              <Tab key="auto-complete" title="地域名を入力">
                {isLoaded && (
                  <LocationAutocomplete digits={digits}></LocationAutocomplete>
                )}
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
      <GeoCode></GeoCode>
    </>
  );
}
