"use client";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function CreateAppointmrnt() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Card className="w-full max-w-sm flex-1">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Schedule and manage your appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
}
