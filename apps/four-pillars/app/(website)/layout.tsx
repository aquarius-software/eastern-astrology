import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import NavbarAlt from "@/components/navbaralt";
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

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  return await sharedMetaData(params);
}

export default async function Layout(props: {
  children: React.ReactNode,
  params: Promise<{ slug: string }>
}) {
  const { children } = props;
  const settings = await getSettings();
  return (
    <UIProviders>
      <NavbarAlt {...settings} />
      <div className="mt-20 md:mt-20">{children}</div>
      <Footer {...settings} />
    </UIProviders >
  );
}
