"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import DateTime from "./Datetime";
import BirthPlace from "./BirthPlace";
import Gender from "./Gender";
import { generateDateFromSubmitData } from "@/utils/utils";
import { SubmitData } from "@/app/types";
import ResultView from "./ResultView";
import Nickname from "./Nickname";
import LoadingChart from "./LoadingChart";
import ErrorView from "ui/ErrorView";
import { SpinnerIcon } from "ui";
import { useRouter } from "next/navigation";
import { useChartContext } from "@/context/chartContext";
import AdvancedSettings from "./AdvancedSettings";
import { Button } from "@heroui/react";
import { generateUrlFromData } from "@/utils/url";
import BreadCrumb from "ui/Breadcrumbs";

// https://v1.tailwindcss.com/components/forms#form-grid
// https://flowbite.com/docs/forms/radio/#horizontal-list-group
// https://stackoverflow.com/questions/7536755/regular-expression-for-matching-hhmm-time-format
// https://github.com/JustFly1984/react-google-maps-api/issues/238

const LOCATION_DIGITS: number = parseInt(
  process.env.NEXT_PUBLIC_LOCATION_DIGITS || "3"
);

export default function Chart(): JSX.Element {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [result, setResult] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const { isFormView, setIsFormView, isJapanese, setIsJapanese } =
    useChartContext();

  const router = useRouter();

  // ページトップにスクロールしない現象を回避するために記述
  // https://github.com/vercel/next.js/issues/28778#issuecomment-1615804722
  useEffect(() => {
    window.scroll(0, 0);
  }, [isSuccess]);

  const useFormMethods = useForm<SubmitData>({
    mode: "onChange",
    defaultValues: {
      month: "1",
      day: "1",
      hour: "12",
      minute: "0",
      cityCode: 13,
      divisionMethod: "S",
      changeDayStem: "F",
      latitude: 35.69,
      longitude: 139.7,
      isHourUnknown: false,
      createImage: false
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isSubmitting }
  } = useFormMethods;

  // ナビゲーションバーの「命式作成」リンクがクリックされた場合にフォームに戻る
  // 既にフォームが表示中の場合は何もしない
  useEffect(() => {
    if (isFormView && isSuccess && isSubmitSuccessful) {
      setIsSuccess(false);
      reset();
      setIsFormView(true);
    }
    setIsJapanese(true);
  }, [
    isFormView,
    setIsFormView,
    isSuccess,
    isSubmitSuccessful,
    reset
  ]);

  // URLが準備できたらリダイレクト
  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl]);

  /**
   * 命式作成ボタンのsubmitイベントハンドラ
   * 命式結果を表示するURLにリダイレクトする
   *
   * @async
   * @param {SubmitData} data
   * @returns {Promise<void>}
   */
  const onSubmitToNewPage = async (
    data: SubmitData
  ): Promise<void> => {
    if (data.botcheck) {
      // Form submission is spam
      return;
    }
    setIsSuccess(true);
    setIsFormView(false);
    reset();

    try {
      data.isJapanese = isJapanese;
      const submittedDate = generateDateFromSubmitData(data);
      data.timezoneOffset = submittedDate.getTimezoneOffset();

      // 海外の命式の場合はTime Zone APIを呼び出す
      if (!isJapanese) {
        const isoDate = generateDateFromSubmitData(data);
        const latitude = Number(data.latitude).toFixed(
          LOCATION_DIGITS
        );
        const longitude = Number(data.longitude).toFixed(
          LOCATION_DIGITS
        );
        const timestamp = isoDate.getTime() / 1000;
        if (!latitude || !longitude || !timestamp) {
          throw new Error(
            "Necessary parameters for Time Zone API are missing."
          );
        }

        // GeoNames Time Zone API呼び出し
        let response = await fetch(
          `${process.env.NEXT_PUBLIC_ROUTE_HANDLER_URL}/api/timezone/geonames`,
          {
            body: JSON.stringify({
              timestamp,
              latitude,
              longitude,
            }),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
            // next: { revalidate: 0 }
          }
        );

        let timezoneData = await response.json();
        if (!response.ok || timezoneData.status !== "OK") {
          console.error(`GeoNames Time Zone API call failed. ${timezoneData.errorMessage}`);
          // GeoNames APIが失敗した場合はバックアップとしてGoogle Maps Time Zone APIを呼び出す
          response = await fetch(
            `${process.env.NEXT_PUBLIC_ROUTE_HANDLER_URL}/api/timezone/google`,
            {
              body: JSON.stringify({
                timestamp,
                latitude,
                longitude,
              }),
              headers: {
                "Content-Type": "application/json"
              },
              method: "POST"
              // next: { revalidate: 0 }
            }
          );
          if (!response.ok) {
            throw new Error(
              `Google Maps Time Zone API call failed. ${response.status} ${response.statusText}`
            );
          }
          timezoneData = await response.json();
        }

        data.timeZoneName = timezoneData.timeZoneName;
        data.timeZoneId = timezoneData.timeZoneId;
        data.rawOffset = timezoneData.rawOffset;
        data.dstOffset = timezoneData.dstOffset;
      }
      const url = await generateUrlFromData(data);
      setRedirectUrl(url);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
    }
  };

  return (
    <>
      <BreadCrumb
        items={[
          {
            label: "命式作成",
            path: "/chart"
          }
        ]}></BreadCrumb>
      {isSuccess && <LoadingChart></LoadingChart>}
      {isSubmitSuccessful && isSuccess && result && (
        // grid-template-columns: repeat(autofit, minmax(25rem, 1fr));
        (<ResultView result={result}></ResultView>)
      )}
      {isSubmitSuccessful && !isSuccess && (
        <ErrorView message="エラーが発生しました。しばらくしてから操作し直してください。"></ErrorView>
      )}
      {!isSubmitSuccessful && !isSuccess && (
        <div className="mx-2 flex flex-col items-center py-2 lg:py-3">
          <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
            命式作成
          </h1>
          <h2 className="mb-8 text-center text-sm dark:text-white sm:text-base">
            四柱推命の命式を<strong>無料</strong>で作成します。
          </h2>
          <div className="flex w-full max-w-2xl flex-col rounded-lg bg-white shadow dark:bg-gray-800 sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-6/12">
            <div className="mx-auto mt-12 w-11/12 md:w-10/12">
              <FormProvider {...useFormMethods}>
                <form
                  onSubmit={handleSubmit(onSubmitToNewPage)}
                  className="mx-auto w-full">
                  <input
                    type="hidden"
                    id=""
                    style={{ display: "none" }}
                    {...register("botcheck")}></input>
                  <div className="chart-form-category">
                    <DateTime></DateTime>
                  </div>
                  <div className="chart-form-category">
                    <BirthPlace digits={LOCATION_DIGITS}></BirthPlace>
                  </div>
                  <div className="chart-form-category">
                    <Gender></Gender>
                  </div>
                  <div className="chart-form-category">
                    <Nickname></Nickname>
                  </div>
                  <div className="chart-form-category">
                    <AdvancedSettings></AdvancedSettings>
                  </div>
                  <div className="mx-auto mb-20 flex w-10/12 flex-wrap">
                    <div className="w-full px-3">
                      <Button
                        type="submit"
                        className="w-full"
                        color="primary"
                        size="lg"
                        radius="sm">
                        {isSubmitting ? (
                          <SpinnerIcon></SpinnerIcon>
                        ) : (
                          "命式作成"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
