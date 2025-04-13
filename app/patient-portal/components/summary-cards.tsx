import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, FileText } from "lucide-react";

interface SummaryCardsProps {
  nextAppointment: string;
  doctorName: string;
  recommendationsCount: number;
  primaryDoctorEmail: string;
}

export function SummaryCards({
  nextAppointment,
  doctorName,
  recommendationsCount,
  primaryDoctorEmail,
}: SummaryCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Next Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">{nextAppointment}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Your Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">{doctorName}</span>
          </div>
          <div className="mt-4">
            <Link href={`mailto:${primaryDoctorEmail}`}>
              <Button variant="outline" size="sm" className="w-full">
                Contact Doctor
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Recent Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">
              {recommendationsCount} new recommendations
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
