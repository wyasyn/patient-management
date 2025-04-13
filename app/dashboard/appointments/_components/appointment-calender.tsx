"use client";
import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";

export default function AppointmentCalender() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border flex-1 max-w-[350px]"
    />
  );
}
