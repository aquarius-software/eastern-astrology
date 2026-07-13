import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import GetNavbar from "@/components/getnavbar";
import { urlForImage } from "@/lib/sanity/image";
import UIProviders from "./uiProviders";

async function sharedMetaData(params: { slug: string }) {
  const settings = await getSettings();

  return {
    metadataBase: new URL(settings.url),
    title: {
      default:
        settings?.title ||
        "",
      template: "%s | 四柱推命ネクスト"
    },
    description:
      settings?.description ||
      "",
    canonical: settings?.url,
    openGraph: {
      images: [
        {
          url:
            urlForImage(settings?.openGraphImage)?.src ||
            "/img/opengraph.jpg",
          width: 1200,
          height: 630
        }
      ]
    },
    twitter: {
      title: settings?.title || "四柱推命ネクスト",
      card: "summary_large_image"
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}) {
  return await sharedMetaData(params);
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { slug: string }
}) {
  const settings = await getSettings();
  return (
    <UIProviders>
      <GetNavbar {...settings} />
      <div className="mt-20 md:mt-20">{children}</div>
      <Footer {...settings} />
    </UIProviders >
  );
}
