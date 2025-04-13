"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cancelAppointment } from "./actions";

interface Appointment {
  id: string;
  doctor: string;
  doctorId: string;
  specialty: string;
  date: string;
  time: string;
  startTime: Date;
  endTime: Date;
  type: string;
  status: string;
  notes?: string | null;
}

interface AppointmentDetailsProps {
  appointment: Appointment;
  onBack: () => void;
}

export function AppointmentDetails({
  appointment,
  onBack,
}: AppointmentDetailsProps) {
  const handleCancel = async () => {
    try {
      const result = await cancelAppointment(appointment.id);

      if (result.success) {
        toast({
          title: "Appointment cancelled",
          description: "Your appointment has been successfully cancelled",
        });
        onBack();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const isPastAppointment = new Date(appointment.startTime) < new Date();
  const canCancel = !isPastAppointment && appointment.status !== "cancelled";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Back to appointments
        </Button>
        <Badge
          variant={
            appointment.status === "confirmed"
              ? "default"
              : appointment.status === "cancelled"
              ? "destructive"
              : "outline"
          }
        >
          {appointment.status.charAt(0).toUpperCase() +
            appointment.status.slice(1)}
        </Badge>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-xl font-medium">
          {appointment.type} with {appointment.doctor}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Date & Time</p>
            <p>
              {appointment.date} at {appointment.time}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Doctor</p>
            <p>{appointment.doctor}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Specialty</p>
            <p>{appointment.specialty}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Duration</p>
            <p>30 minutes</p>
          </div>
        </div>

        {appointment.notes && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Notes</p>
            <p className="mt-1 whitespace-pre-wrap text-sm">
              {appointment.notes}
            </p>
          </div>
        )}

        {canCancel && (
          <div className="mt-6 flex justify-end">
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
