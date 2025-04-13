import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import {
  format,
  isToday,
  isTomorrow,
  isThisWeek,
  differenceInDays,
} from "date-fns";

export const formatDate = (date: string) => {
  // Get the current date
  const now = new Date();

  // Format the date with time
  const formattedDate = format(date, "yyyy-MM-dd HH:mm");

  // Check if the appointment is today, tomorrow, or within the next week
  if (isToday(date)) {
    return `Today, ${formattedDate.split(" ")[1]}`; // Only show time
  }
  if (isTomorrow(date)) {
    return `Tomorrow, ${formattedDate.split(" ")[1]}`; // Only show time
  }
  if (isThisWeek(date)) {
    const daysDiff = differenceInDays(date, now);
    if (daysDiff === 2) {
      return `In 2 days, ${formattedDate.split(" ")[1]}`;
    }
    if (daysDiff === 1) {
      return `Tomorrow, ${formattedDate.split(" ")[1]}`;
    }
    return `${formattedDate.split(" ")[0]}, ${formattedDate.split(" ")[1]}`; // If within this week, show day & time
  }
  if (differenceInDays(date, now) > 7) {
    return `Next Week, ${formattedDate.split(" ")[1]}`; // If next week, show time
  }
  return formattedDate; // Default return in yyyy-MM-dd HH:mm format
};
