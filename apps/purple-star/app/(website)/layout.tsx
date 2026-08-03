import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import NavbarAlt from "@/components/navbaralt";
import { urlForImage } from "@/lib/sanity/image";
import UIProviders from "./uiProviders";

async function sharedMetaData(params) {
  const settings = await getSettings();

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: settings?.title || "",
      template: "%s | 紫微斗数ネクスト"
    },
    description: settings?.description || "",
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
      title: settings?.title || "紫微斗数ネクスト",
      card: "summary_large_image"
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export async function generateMetadata(props) {
  const params = await props.params;
  return await sharedMetaData(params);
}

export default async function Layout(props) {
  const { children } = props;
  const settings = await getSettings();
  return (
    <UIProviders>
      <NavbarAlt {...settings} />
      <div className="mt-20 md:mt-20">{children}</div>
      <Footer {...settings} />
    </UIProviders>
  );
}
