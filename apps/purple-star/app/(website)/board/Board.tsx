"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import DateTime from "./Datetime";
import BirthPlace from "./BirthPlace";
import Gender from "./Gender";
import { PurpleStarSubmitData } from "@/app/types";
import ResultView from "./ResultView";
import Nickname from "./Nickname";
import AdvancedSettings from "./AdvancedSettings";
import LoadingChart from "./LoadingChart";
import ErrorView from "ui/ErrorView";
import { SpinnerIcon } from "ui";
import { useRouter } from "next/navigation";
import { useBoardContext } from '@/context/boardContext';
import { Button } from "@heroui/react";
import { generateUrlFromData } from "@/utils/url";
import { generateDateFromSubmitData } from "@/utils/utils";
import BreadCrumb from "ui/Breadcrumbs";

const LOCATION_DIGITS: number = parseInt(process.env.NEXT_PUBLIC_LOCATION_DIGITS || "3");

export default function Board(): JSX.Element {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [result, setResult] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const { isFormView, setIsFormView, isJapanese, setIsJapanese } = useBoardContext();

  const router = useRouter();

  // ページトップにスクロールしない現象を回避するために記述
  // https://github.com/vercel/next.js/issues/28778#issuecomment-1615804722
  useEffect(() => {
    window.scroll(0, 0);
  }, [isSuccess]);

  const useFormMethods = useForm<PurpleStarSubmitData>({
    mode: "onChange",
    defaultValues: {
      month: "1",
      day: "1",
      hour: "12",
      minute: "0",
      cityCode: 13,
      latitude: 35.69,
      longitude: 139.70,
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isSubmitting }
  } = useFormMethods;

  // ナビゲーションバーの「命盤作成」リンクがクリックされた場合にフォームに戻る
  // 既にフォームが表示中の場合は何もしない
  useEffect(() => {
    if (isFormView && isSuccess && isSubmitSuccessful) {
      setIsSuccess(false);
      reset();
      setIsFormView(true);
    }
    setIsJapanese(true);
  }, [isFormView, setIsFormView, isSuccess, isSubmitSuccessful, reset])

  // URLが準備できたらリダイレクト
  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl]);

  /**
   * 命盤作成ボタンのsubmitイベントハンドラ
   * 命盤結果URLにリダイレクト
   *
   * @async
   * @param {PurpleStarSubmitData} data
   * @returns {Promise<void>}
   */
  const onSubmitToNewPage = async (data: PurpleStarSubmitData): Promise<void> => {
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

      // 海外の命盤の場合はTime Zone APIを呼び出す
      if (!isJapanese) {
        const isoDate = generateDateFromSubmitData(data);
        const latitude = Number(data.latitude).toFixed(LOCATION_DIGITS);
        const longitude = Number(data.longitude).toFixed(LOCATION_DIGITS);
        const timestamp = isoDate.getTime() / 1000;
        if (!latitude || !longitude || !timestamp) {
          throw new Error("Necessary parameters for Time Zone API are missing.");
        }
        // const googleMapsUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude}%2C${longitude}&timestamp=${timestamp.toString()}&language=ja&key=${process.env.NEXT_PUBLIC_GOOGLE_TIMEZONE_API_KEY}`;
        // const response = await fetch(googleMapsUrl);
        const response = await fetch(
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
        const timezoneData = await response.json();
        if (timezoneData.status !== "OK") {
          throw new Error(
            `Google Maps Time Zone API call failed for a following reason. ${timezoneData.errorMessage}`
          );
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
            label: "命盤作成",
            path: "/board"
          }
        ]}></BreadCrumb>
      {isSuccess && (
        <LoadingChart></LoadingChart>
      )}
      {isSubmitSuccessful && isSuccess && result && (
        // grid-template-columns: repeat(autofit, minmax(25rem, 1fr));
        <ResultView result={result}></ResultView>
      )}
      {isSubmitSuccessful && !isSuccess && (
        <ErrorView message="エラーが発生しました。しばらくしてから操作し直してください。"></ErrorView>
      )}
      {!isSubmitSuccessful && !isSuccess && (
        <div className="flex flex-col items-center mx-2">
          <div className="flex w-full max-w-2xl flex-col rounded-lg bg-white shadow dark:bg-gray-800 sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-6/12">
            <h1 className="text-brand-primary mb-3 mt-12 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
              命盤作成
            </h1>
            <div className="text-center">
              <p className="text-lg dark:text-white">
                紫微斗数の命盤を<strong>無料</strong>で作成します。
              </p>
            </div>
            <div className="mx-auto mt-12 w-11/12 md:w-10/12">
              <FormProvider {...useFormMethods}>
                <form
                  onSubmit={handleSubmit(onSubmitToNewPage)}
                  className="mx-auto w-full">
                  <input
                    type="hidden"
                    id=""
                    style={{ display: "none" }}
                    {...register("botcheck")}>
                  </input>
                  <div className="mb-10">
                    <DateTime></DateTime>
                  </div>
                  <div className="mb-10">
                    <BirthPlace digits={LOCATION_DIGITS}></BirthPlace>
                  </div>
                  <div className="mb-10">
                    <Gender></Gender>
                  </div>
                  <div className="mb-10">
                    <Nickname></Nickname>
                  </div>
                  <div className="mb-10">
                    <AdvancedSettings></AdvancedSettings>
                  </div>
                  <div className="w-10/12 mx-auto mb-20 flex flex-wrap">
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
                          "命盤作成"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div >
      )
      }
    </>
  );
}
