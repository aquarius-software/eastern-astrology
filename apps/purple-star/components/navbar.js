"use client";

import { Fragment } from "react";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import cx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import ThemeSwitch from "@/components/themeSwitch";
import { useBoardContext } from "@/context/boardContext";
import { Chip } from "@heroui/react";

export default function Navbar(props) {
  const leftmenu = [
    {
      label: "ホーム",
      href: "#"
    },
    {
      label: "紫微斗数ネクストについて",
      href: "/about"
    }
  ];

  const rightmenu = [
    {
      label: "命盤作成",
      href: "/board",
      external: false
    },
    {
      label: "お問い合わせ",
      href: "/contact",
      external: false
    }
  ];

  const mobilemenu = [...leftmenu, ...rightmenu];

  const { setIsFormView } = useBoardContext();

  return (
    <nav className="mb-4 bg-white py-4 shadow-md dark:bg-black md:mb-8">
      <Disclosure>
        {({ open }) => (
          <>
            <div className="flex flex-wrap justify-between font-bold md:flex-nowrap md:gap-10">
              <div className="order-1 hidden w-full flex-col items-center justify-start md:order-none md:flex md:w-auto md:flex-1 md:flex-row md:justify-end">
                {leftmenu.map((item, index) => (
                  <Fragment key={`${item.label}${index}`}>
                    {item.children && item.children.length > 0 ? (
                      <DropdownMenu
                        menu={item}
                        key={`${item.label}${index}`}
                        items={item.children}
                      />
                    ) : (
                      <Link
                        href={item.href}
                        prefetch={false}
                        key={`${item.label}${index}`}
                        className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-blue-500 dark:text-gray-400"
                        target={item.external ? "_blank" : ""}
                        rel={item.external ? "noopener" : ""}>
                        {item.label}
                      </Link>
                    )}
                  </Fragment>
                ))}
              </div>
              <div className="flex w-full items-center justify-between md:w-auto">
                <Link
                  href="/"
                  className="w-28 dark:hidden"
                  prefetch={false}>
                  {props.logo ? (
                    <Image
                      {...urlForImage(props.logo)}
                      alt="Logo"
                      priority={true}
                      sizes="(max-width: 640px) 100vw, 200px"
                    />
                  ) : (
                    <span className="block text-center">紫微斗数ネクスト</span>
                  )}
                </Link>
                <Link
                  href="/"
                  className="hidden w-28 dark:block"
                  prefetch={false}>
                  {props.logoalt ? (
                    <Image
                      {...urlForImage(props.logoalt)}
                      alt="Logo"
                      priority={true}
                      sizes="(max-width: 640px) 100vw, 200px"
                    />
                  ) : (
                    <span className="block text-center">紫微斗数ネクスト</span>
                  )}
                </Link>
                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="ml-auto rounded-md px-2 py-1 text-gray-500 focus:text-blue-500 focus:outline-none dark:text-gray-300 md:hidden ">
                  <svg
                    className="h-6 w-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>
              </div>

              <div className="order-2 hidden w-full flex-col items-center justify-start md:order-none md:flex md:w-auto md:flex-1 md:flex-row">
                {rightmenu.map((item, index) => (
                  <Fragment key={`${item.label}${index}`}>
                    {item.children && item.children.length > 0 ? (
                      <DropdownMenu
                        menu={item}
                        key={`${item.label}${index}`}
                        items={item.children}
                      />
                    ) : (
                      <Link
                        href={item.href}
                        prefetch={false}
                        onClick={() => {
                          setIsFormView(true);
                        }}
                        key={`${item.label}${index}`}
                        className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-blue-500 dark:text-gray-400"
                        target={item.external ? "_blank" : ""}
                        rel={item.external ? "noopener" : ""}>
                        {item.label}
                        {item.href.includes("chart") && (
                          <Chip className="ml-2" color="default">
                            無料
                          </Chip>
                        )}
                      </Link>
                    )}
                  </Fragment>
                ))}
                <ThemeSwitch></ThemeSwitch>
              </div>
            </div>
            <Disclosure.Panel>
              <div className="order-2 -ml-4 mt-4 flex w-full flex-col items-center justify-start md:hidden">
                {mobilemenu.map((item, index) => (
                  <Fragment key={`${item.label}${index}`}>
                    {item.children && item.children.length > 0 ? (
                      <DropdownMenu
                        menu={item}
                        key={`${item.label}${index}`}
                        items={item.children}
                        mobile={true}
                      />
                    ) : (
                      <Link
                        href={item.href}
                        prefetch={false}
                        key={`${item.label}${index}`}
                        className="w-full px-5 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400"
                        target={item.external ? "_blank" : ""}
                        rel={item.external ? "noopener" : ""}>
                        {item.label}
                      </Link>
                    )}
                  </Fragment>
                ))}
                <ThemeSwitch></ThemeSwitch>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </nav>
  );
}

const DropdownMenu = ({ menu, items, mobile }) => {
  return (
    <Menu
      as="div"
      className={cx("relative text-left", mobile && "w-full")}>
      {({ open }) => (
        <>
          <Menu.Button
            className={cx(
              "flex items-center gap-x-1 rounded-md px-5 py-2 text-sm font-bold outline-none transition-all focus:outline-none focus-visible:text-indigo-500 focus-visible:ring-1 dark:focus-visible:bg-gray-800",
              open
                ? "text-blue-500 hover:text-blue-500"
                : " text-gray-600 dark:text-gray-400 ",
              mobile ? "w-full px-4 py-2 " : "inline-block px-4 py-2"
            )}>
            <span>{menu.label}</span>
            <ChevronDownIcon className="mt-0.5 h-4 w-4" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="lg:transition lg:ease-out lg:duration-100"
            enterFrom="lg:transform lg:opacity-0 lg:scale-95"
            enterTo="lg:transform lg:opacity-100 lg:scale-100"
            leave="lg:transition lg:ease-in lg:duration-75"
            leaveFrom="lg:transform lg:opacity-100 lg:scale-100"
            leaveTo="lg:transform lg:opacity-0 lg:scale-95">
            <Menu.Items
              className={cx(
                "z-20 origin-top-left rounded-md  focus:outline-none  lg:absolute lg:left-0  lg:w-56",
                !mobile && "bg-white shadow-lg  dark:bg-gray-800"
              )}>
              <div className={cx(!mobile && "py-3")}>
                {items.map((item, index) => (
                  <Menu.Item as="div" key={`${item.title}${index}`}>
                    {({ active }) => (
                      <Link
                        href={item?.path ? item.path : "#"}
                        prefetch={false}
                        className={cx(
                          "flex items-center space-x-2 px-5 py-2 text-sm lg:space-x-4",
                          active
                            ? "text-blue-500"
                            : "text-gray-700 hover:text-blue-500 focus:text-blue-500 dark:text-gray-300"
                        )}>
                        <span> {item.title}</span>
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
