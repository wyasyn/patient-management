"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Doctor } from "../types";

interface AppointmentDetailsProps {
  doctors: Doctor[];
  doctorId: string;
  setDoctorId: (id: string) => void;
  appointmentType: string;
  setAppointmentType: (type: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export function AppointmentDetails({
  doctors,
  doctorId,
  setDoctorId,
  appointmentType,
  setAppointmentType,
  notes,
  setNotes,
}: AppointmentDetailsProps) {
  const appointmentTypes = [
    { id: "Check-up", name: "Check-up" },
    { id: "Consultation", name: "Consultation" },
    { id: "Follow-up", name: "Follow-up" },
    { id: "Test Results", name: "Test Results" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
        <CardDescription>
          Provide information about your appointment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Doctor</label>
          <Select value={doctorId} onValueChange={setDoctorId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name} ({d.specialty})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Appointment Type</label>
          <Select value={appointmentType} onValueChange={setAppointmentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes (Optional)</label>
          <Textarea
            placeholder="Please describe the reason for your visit or any symptoms you're experiencing"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
