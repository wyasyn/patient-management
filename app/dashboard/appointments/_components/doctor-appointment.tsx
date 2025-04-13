import { getDoctorAppointments } from "@/app/actions/appointments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";
import { AppointmentStatusSelect } from "./appointment-status-select";

export default async function DoctorAppointments() {
  const appointments = await getDoctorAppointments();

  if (!appointments || appointments.length === 0) {
    return <div className="p-8">No appointments found</div>;
  }

  return (
    <div className="p-4 overflow-auto">
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex border-l-4 border-emerald-500">
                <div className="flex items-center justify-center bg-gray-50 p-4 text-center">
                  <div>
                    <Clock className="mx-auto h-5 w-5 text-gray-500" />
                    <p className="mt-1 font-medium">
                      {formatDate(appointment.startTime.toISOString())}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(new Date(appointment.endTime).getTime() -
                        new Date(appointment.startTime).getTime()) /
                        60000}{" "}
                      minutes
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {appointment.patient.user.firstName[0]}
                        {appointment.patient.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {appointment.patient.user.firstName}{" "}
                        {appointment.patient.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppointmentStatusSelect
                      appointmentId={appointment.id}
                      initialStatus={appointment.status}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
