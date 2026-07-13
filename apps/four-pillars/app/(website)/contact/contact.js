"use client";

import Container from "@/components/container";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useWeb3Forms from "@web3forms/react";
import BreadCrumb from "ui/Breadcrumbs";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Contact({ settings, ip }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitSuccessful, isSubmitting }
  } = useForm({
    mode: "onTouched"
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState(false);
  // Please update the Access Key in the Sanity CMS - Site Congig Page
  const apiKey = settings?.w3ckey || "YOUR_ACCESS_KEY_HERE";

  const { submit: onSubmit } = useWeb3Forms({
    access_key: apiKey,
    settings: {
      from_name: "四柱推命ネクスト",
      subject: `四柱推命ネクストからお問い合わせが1件あります。${ip}`
    },
    onSuccess: (msg, data) => {
      setIsSuccess(true);
      setMessage(
        "この度はお問い合わせありがとうございました。ご返信させていただきますので、しばらくお待ちくださいますようお願い申し上げます。"
      );
      reset();
    },
    onError: (msg, data) => {
      setIsSuccess(false);
      setMessage(msg);
    }
  });

  const onHCaptchaChange = token => {
    setValue("h-captcha-response", token);
  };

  return (
    <>
      <BreadCrumb
        items={[
          {
            label: "お問い合わせフォーム",
            path: "/contact"
          }
        ]}></BreadCrumb>
      <Container>
        <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
          お問い合わせフォーム
        </h1>
        <div className="grid gap-x-16 md:grid-cols-2">
          <div className="mb-2 mt-8">
            <p className="mt-0 md:mt-5">
              機能追加のご要望やバグのご報告等、四柱推命ネクストへのお問い合わせはこちらのフォームからお気軽にお寄せください。
            </p>
            <p className="mt-5">
              メールアドレスが間違っている等の理由により、内容によってはご返信いたしかねる場合がございますので、ご了承いただけますようお願い申し上げます。
            </p>
            <p className="mt-5">
              自動返信による、お問い合わせ受け付けメールは送信しておりません。必要な場合は、お問い合わせ内容をメモ等に保存されることをお勧めいたします。
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="my-10">
              <input
                type="checkbox"
                id=""
                className="hidden"
                style={{ display: "none" }}
                {...register("botcheck")}></input>

              <div className="mb-5">
                <input
                  type="text"
                  placeholder="お名前"
                  autoComplete="false"
                  className={`w-full rounded-md border-2 px-4 py-3 outline-none placeholder:text-gray-800 focus:ring-4 dark:bg-gray-900 dark:text-white   dark:placeholder:text-gray-200  ${
                    errors.name
                      ? "border-red-600 ring-red-100 focus:border-red-600 dark:ring-0"
                      : "border-gray-300 ring-gray-100 focus:border-gray-600 dark:border-gray-600 dark:ring-0 dark:focus:border-white"
                  }`}
                  {...register("name", {
                    required: "お名前を入力してください",
                    maxLength: {
                      value: 30,
                      message: "お名前は30文字以内で入力してください"
                    }
                  })}
                />
                {errors.name && (
                  <div className="mt-1 font-bold text-red-600">
                    <small>{errors.name.message}</small>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label htmlFor="email_address" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email_address"
                  type="email"
                  placeholder="メールアドレス"
                  name="email"
                  autoComplete="false"
                  className={`w-full rounded-md border-2 px-4 py-3 outline-none placeholder:text-gray-800 focus:ring-4 dark:bg-gray-900 dark:text-white   dark:placeholder:text-gray-200  ${
                    errors.email
                      ? "border-red-600 ring-red-100 focus:border-red-600 dark:ring-0"
                      : "border-gray-300 ring-gray-100 focus:border-gray-600 dark:border-gray-600 dark:ring-0 dark:focus:border-white"
                  }`}
                  {...register("email", {
                    required: "メールアドレスを入力してください",
                    maxLength: {
                      value: 80,
                      message:
                        "メールアドレスは80文字以内で入力してください"
                    },
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message:
                        "正しいメールアドレスを入力してください"
                    }
                  })}
                />
                {errors.email && (
                  <div className="mt-1 font-bold text-red-600">
                    <small>{errors.email.message}</small>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <textarea
                  name="message"
                  placeholder="お問い合わせ内容"
                  className={`h-60 w-full rounded-md border-2 px-4 py-3 outline-none placeholder:text-gray-800   focus:ring-4 dark:bg-gray-900  dark:text-white dark:placeholder:text-gray-200  ${
                    errors.message
                      ? "border-red-600 ring-red-100 focus:border-red-600 dark:ring-0"
                      : "border-gray-300 ring-gray-100 focus:border-gray-600 dark:border-gray-600 dark:ring-0 dark:focus:border-white"
                  }`}
                  {...register("message", {
                    required: "お問い合わせ内容を入力してください",
                    maxLength: {
                      value: 300,
                      message:
                        "お問い合わせ内容は300文字以内で入力してください"
                    }
                  })}
                />
                {errors.message && (
                  <div className="mb-6 mt-1 font-bold text-red-600">
                    {" "}
                    <small>{errors.message.message}</small>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <HCaptcha
                  sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                  onVerify={onHCaptchaChange}
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="w-8/12 rounded-md bg-gray-900 px-7 py-4 font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-200 focus:ring-offset-2 dark:bg-white dark:text-black ">
                  {isSubmitting ? (
                    <svg
                      className="mx-auto h-5 w-5 animate-spin text-white dark:text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "送信"
                  )}
                </button>
              </div>
            </form>

            {isSubmitSuccessful && isSuccess && (
              <div className="currentColor mt-3 text-left text-base">
                {message || "お問い合わせありがとうございました。"}
              </div>
            )}
            {isSubmitSuccessful && !isSuccess && (
              <div className="mt-3 text-center text-base text-red-500">
                {message || "Something went wrong. Please try later."}
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
