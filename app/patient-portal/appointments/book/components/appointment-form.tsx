"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { createAppointment } from "../action";
import { AppointmentDetails } from "./appointment-details";
import { AppointmentConfirmation } from "./appointment-confirmation";
import type { Doctor } from "../types";
import { DateTimeSelector } from "./date-time-selector";

interface AppointmentFormProps {
  doctors: Doctor[];
}

export function AppointmentForm({ doctors }: AppointmentFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !doctorId || !appointmentType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse time string to get hours and minutes
      const [hourStr, minuteStr, period] = time.split(/:|\s/);
      let hours = Number.parseInt(hourStr);
      const minutes = Number.parseInt(minuteStr);

      // Convert to 24-hour format if PM
      if (period === "PM" && hours < 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      // Create start time by combining date and time
      const startTime = new Date(date!);
      startTime.setHours(hours, minutes, 0, 0);

      // Create end time (30 minutes after start time)
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);

      // Call server action to create appointment
      const result = await createAppointment({
        doctorId,
        startTime,
        endTime,
        type: appointmentType,
        notes: notes || undefined,
      });

      if (result.success) {
        toast({
          title: "Appointment booked",
          description: "Your appointment has been successfully scheduled",
        });
        router.push("/patient-portal");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <DateTimeSelector
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
        />

        <AppointmentDetails
          doctors={doctors}
          doctorId={doctorId}
          setDoctorId={setDoctorId}
          appointmentType={appointmentType}
          setAppointmentType={setAppointmentType}
          notes={notes}
          setNotes={setNotes}
        />
      </div>

      <AppointmentConfirmation
        date={date}
        time={time}
        doctorId={doctorId}
        doctors={doctors}
        appointmentType={appointmentType}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
