"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import { EventInput } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";

const getEvents = async (info: any, successCallback: any) => {
  try {
    const startDateStr = info.startStr;
    const endDateStr = info.endStr;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROUTE_HANDLER_URL}/api/calendar`,
      {
        body: JSON.stringify({
          startDate: startDateStr,
          endDate: endDateStr
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        next: { revalidate: 0 }
      }
    );
    if (!response.ok) {
      // 429などボディが空のレスポンスがあるため、json()の前に判定する
      console.error(`Calendar API call failed. (${response.status})`);
      successCallback([]);
      return;
    }
    const result = await response.json();
    // 配列以外を渡すとFullCalendarが "rawEvents is not iterable" で落ちる
    successCallback(Array.isArray(result) ? result : []);
  } catch (error) {
    console.error(error);
    successCallback([]);
  }
};

export default function Calendar() {
  const fullYear = new Date().getFullYear();

  return (
    <div className="mx-6 sm:mx-12 md:mx-24 lg:mx-60">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale={jaLocale}
        events={(info, successCallback) =>
          getEvents(info, successCallback)
        }
        displayEventTime={false}
        displayEventEnd={false}
        contentHeight={"auto"}
        validRange={{
          start: `${String(fullYear - 1)}-01-01`,
          end: `${String(fullYear + 2)}-01-01`
        }}
      />
    </div>
  );
}
