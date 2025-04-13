import { getDoctorDashboardStats } from "@/app/actions/doctor-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

export default async function Stats() {
  const myStats = await getDoctorDashboardStats();
  const {
    appointmentsToday,
    weeklyPatients,
    monthlyPatients,
    recommendations,
  } = myStats;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 " />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyPatients.total}</div>
          <p className="text-xs text-gray-500">
            {monthlyPatients.increaseFromLastMonth} from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Appointments Today
          </CardTitle>
          <Calendar className="h-4 w-4 " />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{appointmentsToday.total}</div>
          <p className="text-xs text-gray-500">
            {appointmentsToday.pending} pending confirmations
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">New Patients</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-gray-500"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyPatients.thisWeek}</div>
          <p className="text-xs text-gray-500">
            +{weeklyPatients.difference} from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Recommendations
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-gray-500"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recommendations.pending}</div>
          <p className="text-xs text-gray-500">Need your attention</p>
        </CardContent>
      </Card>
    </div>
  );
}
