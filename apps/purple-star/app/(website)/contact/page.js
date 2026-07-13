import { getSettings } from "@/lib/sanity/client";
import Contact from "./contact";
import { headers } from "next/headers";

export const metadata = {
  title: "お問い合わせ",
  description: "紫微斗数ネクストのお問い合わせフォームです。",
  alternates: {
    canonical: "/contact"
  },
  robots: {
    index: false
  }
};

export default async function ContactPage() {
  const settings = await getSettings();
  const ip = headers().get("x-forwarded-for");

  return (
    <>
      <Contact settings={settings} ip={ip} />
    </>
  );
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
