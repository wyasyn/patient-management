import { getUpcomingAppointmentsFromTodayOnwards } from "@/app/actions/appointments";
import { AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import Link from "next/link";

export default async function UpcomingEvents() {
  const upcomingAppointments = await getUpcomingAppointmentsFromTodayOnwards();
  if (!upcomingAppointments || upcomingAppointments.length === 0) {
    return (
      <Card className="hidden md:block flex-1">
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>No upcoming appointments found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full flex-1">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>
          You have {upcomingAppointments.length} appointments scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {appointment.patientName.charAt(0).toUpperCase() + " "}
                    {appointment.patientName.split(" ")[1].charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(appointment.appointmentDate.toISOString())}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    appointment.status === "CONFIRMED" ? "default" : "outline"
                  }
                >
                  {appointment.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Link href="/dashboard/appointments">
            <Button variant="outline" size="sm">
              View All Appointments
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
