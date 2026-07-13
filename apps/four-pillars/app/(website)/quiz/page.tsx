import Quiz from "./quiz";
import BreadCrumb from "ui/Breadcrumbs";

export const metadata = {
  title: "四柱推命クイズ",
  description: "四柱推命に関するクイズをランダムに出題するページです。",
  alternates: {
    canonical: "/quiz"
  },
  robots: {
    index: true
  }
};

export default async function QuizPage() {
  return (
    <>
      <BreadCrumb
        items={[
          {
            label: "四柱推命クイズ",
            path: "/quiz"
          }
        ]}></BreadCrumb>
      <div className="flex items-center justify-center">
        <Quiz></Quiz>
      </div>
    </>
  );
}

export const revalidate = Number(process.env.REVALIDATE_SECONDS);
