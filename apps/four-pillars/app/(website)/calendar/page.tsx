import BreadCrumb from "ui/Breadcrumbs";
import Calendar from "./Calendar";

export const metadata = {
  title: "カレンダー",
  description: "四柱推命のカレンダーです。",
  alternates: {
    canonical: "/calendar"
  },
  robots: {
    index: true
  }
};

export default function CalendarPage() {
  return (
    <>
      <BreadCrumb
        items={[
          {
            label: "カレンダー",
            path: "/calendar"
          }
        ]}></BreadCrumb>
      <Calendar></Calendar>
    </>
  );
}