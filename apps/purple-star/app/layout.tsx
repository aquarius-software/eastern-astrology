import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, Lora, Noto_Sans_JP } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora"
});

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={cx(noto.variable, "bg-gray-50")}>
      <body className="bg-gray-50 text-gray-800 antialiased dark:bg-gray-950 dark:text-gray-400 font-table">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
