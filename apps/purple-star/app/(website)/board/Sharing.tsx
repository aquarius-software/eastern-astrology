'use client';

import { useEffect, useState, useRef } from "react";
import { PurpleStarProps } from "@/app/types";
import {
  ShareIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Tooltip } from 'react-tooltip'
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
  HatenaShareButton,
  HatenaIcon,
  PocketShareButton,
  PocketIcon,
  InstapaperShareButton,
  InstapaperIcon,
  EmailShareButton,
  EmailIcon
} from 'next-share';
import { generateUrlFromResult } from "@/utils/url";

export default function Sharing({
  result
}: PurpleStarProps): JSX.Element {
  const pathName = usePathname();
  const [flash, setFlash] = useState(false);
  const [sharedUrl, setSharedUrl] = useState("");
  const [isSecure, setIsSecure] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const splitPaths = pathName!.split("/");
        if (splitPaths.length === 3 && splitPaths[2] !== "") {
          // 既に保存用URLで表示している場合
          setSharedUrl(`${window.location.origin}${pathName}`);
        } else {
          const data = {

          };
          const urlStr = await generateUrlFromResult(result);
          setSharedUrl(urlStr);
        }
      } catch (error) {
        console.error(error);
        setSharedUrl("");
      }
    })();
  }, [result, pathName]);

  useEffect(() => {
    setIsSecure(window.isSecureContext);
    // Clear the interval when the component unmounts
    return () => clearTimeout(timerRef.current as NodeJS.Timeout);
  }, []);

  /**
   * URLをクリップボードにコピー
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const copyToClipboard = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    navigator.clipboard.writeText(sharedUrl);
    setFlash(true);
    timerRef.current = setTimeout(() => {
      setFlash(false);
    }, 3000);
  };

  return (
    <div className="section-container">
      <div className="section-header flex items-center border-b dark:border-b-0">
        <ShareIcon className="section-icon" />
        共有
      </div>
      <div className="p-4 text-base bg-white dark:bg-gray-800 rounded-b-lg">
        <div className="flex justify-start gap-2 mb-6">
          <FacebookShareButton
            url={sharedUrl} >
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton
            url={sharedUrl} >
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <LineShareButton
            url={sharedUrl} >
            <LineIcon size={40} round />
          </LineShareButton>
          <HatenaShareButton
            url={sharedUrl} >
            <HatenaIcon size={40} round />
          </HatenaShareButton>
          <PocketShareButton
            url={sharedUrl} >
            <PocketIcon size={40} round />
          </PocketShareButton>
          <InstapaperShareButton
            url={sharedUrl} >
            <InstapaperIcon size={40} round />
          </InstapaperShareButton>
          <EmailShareButton
            url={sharedUrl} >
            <EmailIcon size={40} round />
          </EmailShareButton>
        </div>
        <h3 className="mb-3 text-left font-bold dark:text-gray-300">保存用URL</h3>
        <div className="flex items-center">
          {isSecure ?
            <>
              <input
                id="url"
                type="text"
                autoComplete="false"
                readOnly
                value={sharedUrl}
                className="block h-full w-full appearance-none rounded-bl-md rounded-tl-md border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 placeholder-[#929DA7] outline-none transition focus:border-gray-200 focus:bg-white focus:outline-none"
              />
              <button
                id="copyToClipboardButton"
                onClick={copyToClipboard}
                data-tooltip-id="copyToClipboardTooltip" data-tooltip-content="URLをコピー"
                className="h-full cursor-pointer appearance-none rounded-br-md rounded-tr-md border border-gray-200 border-stroke bg-gray-1 px-4 py-3">
                <ClipboardDocumentIcon className="section-icon" />
              </button>
              <Tooltip id="copyToClipboardTooltip" />
            </>
            :
            <input
              id="url"
              type="text"
              autoComplete="false"
              readOnly
              value={sharedUrl}
              className="block h-full w-full appearance-none rounded-md border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 placeholder-[#929DA7] outline-none transition focus:border-gray-200 focus:bg-white focus:outline-none"
            />
          }
        </div>
        {flash && (
          <h3 className="mt-3 flex text-left text-sm font-bold text-gray-500">
            <CheckCircleIcon className="section-icon" />
            URLをクリップボードにコピーしました。
          </h3>
        )}
        {sharedUrl === "" && (
          <h3 className="mt-3 flex text-left text-sm font-bold text-red-500">
            <ExclamationCircleIcon className="section-icon" />
            保存用URLを表示できません。
          </h3>
        )}
      </div>
    </div>
  );
}
