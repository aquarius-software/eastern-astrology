"use client";

import { ThemeProvider } from "next-themes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { jaJP } from "@mui/x-date-pickers/locales";
import ja from "date-fns/locale/ja";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <LocalizationProvider
        localeText={
          jaJP.components.MuiLocalizationProvider.defaultProps
            .localeText
        }
        dateAdapter={AdapterDateFns}
        adapterLocale={ja}
        dateFormats={{
          monthAndYear: "yyyy年 M月",
          monthShort: "M月"
        }}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
