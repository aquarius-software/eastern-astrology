import ThemeSwitch from "@/components/themeSwitch";

export default function Footer(props) {
  return (
    <div className="mt-4 border-t border-gray-100 pb-8 pt-8 dark:border-gray-800">
      <div className="text-center text-sm">
        Copyright © {new Date().getFullYear()} {props?.copyright}.
        <br />
        All rights reserved.
      </div>
      <div className="mt-2 flex items-center justify-center">
        {/* <ThemeSwitch /> */}
      </div>
    </div>
  );
}