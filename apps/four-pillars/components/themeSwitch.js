"use client";

import { useTheme } from "next-themes";
import { SunIcon } from "@heroicons/react/24/outline";

const ThemeSwitch = () => {
  //   const [mounted, setMounted] = useState(false);
  //   const { resolvedTheme, setTheme } = useTheme();
  const { theme, setTheme } = useTheme();
  // useEffect only runs on the client, so now we can safely show the UI
  //   useEffect(() => {
  //     setMounted(true);
  //   }, []);

  //   if (!mounted) {
  //     return null;
  //   }

  return (
    <div className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
      <SunIcon className="mr-2 h-4 w-4" />
      <select
        name="themeSwitch"
        value={theme}
        onChange={e => setTheme(e.target.value)}>
        <option value="system">システム</option>
        <option value="dark">ダーク</option>
        <option value="light">ライト</option>
      </select>
    </div>
  );
};

export default ThemeSwitch;
