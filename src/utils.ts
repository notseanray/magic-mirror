import {
  COUNTRY,
  GOOGLE_CALENDAR_API_KEY,
  HOLIDAY_MONTH_INCLUDE,
  WTTRIN_API,
} from "./constants";
import {CalendarEvent, CalendarEvents} from "./types";

const numberToMonth = (d: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[d];
};

const numberToDay = (d: number): string => {
  const days = [
    "Monday",
    "Tuesday",
    "Wenesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[d];
};

const dateSuffix = (day: number): string => {
  if (day == 1 || day == 21 || day == 31) {
    return day + "st";
  }
  return day + "th";
};

// const removeLeading0 = (date: string): number => {
//     if (date == "00") {
//         return 0;
//     }
//     if (date.startsWith("0") && date != "00") {
//         console.log("test")
//         console.log(date);
//         return parseInt(date.slice(1));
//     }
//     console.log(date);
//     return parseInt(date);
// };

export const formatCalendarDay = (time: string) => {
  const d = time.toString();
  return `${numberToMonth(parseInt(d.slice(5, 7)) - 1).slice(0, 3)} ${
      dateSuffix(parseInt(d.slice(8)))}`;
};

export const weather = async () => {
  const api = await fetch(WTTRIN_API).then((t) => t.text());
  const text = api.split(":");
  return {
    location : text[0],
    data : text[1],
  };
};

export const leading0 = (d: number): string => {
  if (d < 10) {
    return "0" + d.toString();
  }
  return d.toString();
};

export const dateSection = (d: Date) => {
  return {
    date : `${numberToDay(d.getDay())}, ${numberToMonth(d.getMonth())} ${
        d.getDay()}, ${d.getFullYear()}`,
    time : `${leading0(d.getHours())}:${leading0(d.getMinutes())}`,
    second : leading0(d.getSeconds()),
  };
};

export const getHolidays = async (d: Date) => {
  const requestURL = `https://www.googleapis.com/calendar/v3/calendars/en.${
      COUNTRY}%23holiday%40group.v.calendar.google.com/events?key=${
      GOOGLE_CALENDAR_API_KEY}`;
  const req = await fetch(requestURL);
  const body = (await req.json()) as CalendarEvents;
  const currentMonth = d.getMonth();
  const currentMonthOffset = (d.getMonth() + HOLIDAY_MONTH_INCLUDE) % 12;
  let result = [];
  let names = [];
  if (!body.items)
    return;
  body.items.forEach((i: CalendarEvent) => {
    if (!names.includes(i.summary)) {
      const year = parseInt(i.start.date.slice(0, 4));
      const start = parseInt(i.start.date.slice(5, 7));
      const end = parseInt(i.end.date.slice(5, 7));
      const skip = year != d.getFullYear();
      if (start)
        if ((end > currentMonth && end < currentMonthOffset) && !skip) {
          names.push(i.summary);
          result.push(i);
        }
    }
  });
  result.sort(function(l, r) {
    const ld = l.start.date;
    const lN = parseInt(ld.slice(0, 4)) * 10000 +
               parseInt(ld.slice(5, 7)) * 100 + parseInt(ld.slice(8, 10));
    const rd = r.start.date;
    const rN = parseInt(rd.slice(0, 4)) * 10000 +
               parseInt(rd.slice(5, 7)) * 100 + parseInt(rd.slice(8, 10));
    if (lN > rN)
      return 1;
    if (lN < rN)
      return -1;
    return 0;
  });
  return result;
};
