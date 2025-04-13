"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Doctor } from "../types";

interface AppointmentConfirmationProps {
  date: Date | undefined;
  time: string;
  doctorId: string;
  doctors: Doctor[];
  appointmentType: string;
  isSubmitting: boolean;
}

export function AppointmentConfirmation({
  date,
  time,
  doctorId,
  doctors,
  appointmentType,
  isSubmitting,
}: AppointmentConfirmationProps) {
  const router = useRouter();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Confirm Appointment</CardTitle>
        <CardDescription>
          Review your appointment details before submitting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p>{date?.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Time</p>
            <p>{time || "Not selected"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Doctor</p>
            <p>
              {doctors.find((d) => d.id === doctorId)?.name || "Not selected"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Appointment Type
            </p>
            <p>{appointmentType || "Not selected"}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={
            !date || !time || !doctorId || !appointmentType || isSubmitting
          }
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
