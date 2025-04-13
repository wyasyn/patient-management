import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import BackButton from "./_components/back-button";
import AppointmentCalender from "./_components/appointment-calender";

import DoctorAppointments from "./_components/doctor-appointment";
import DoctorCreateAppointment from "./_components/doctor-create-appointment";

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-xl font-semibold">Appointments</h1>
        </div>
        <div className="flex items-center gap-2">
          <DoctorCreateAppointment />
        </div>
      </div>
      <div className="grid md:grid-cols-[300px_1fr] h-full">
        <div className="border-r p-4">
          <AppointmentCalender />
          <div className="mt-6">
            <h3 className="mb-2 font-medium">Appointment Types</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm">Check-up</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm">Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                <span className="text-sm">Follow-up</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-sm">New Patient</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="mb-2 font-medium">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">Confirmed</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </div>
        </div>
        <DoctorAppointments />
      </div>
    </div>
  );
}
