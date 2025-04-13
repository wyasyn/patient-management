import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateAppointmrnt from "./_component/CreateAppointmrnt";
import { getCurrentUser } from "../actions/auth";
import Stats from "./_component/Stats";
import UpcomingEvents from "./_component/UpcomingEvents";
import RecentPatients from "./_component/RecentPatients";

export default async function DashboardPage() {
  // Mock data - in a real app, this would come from your database

  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  return (
    <div className=" min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6">
          <div className="grid gap-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, Dr. {user.firstName}
              </h1>
              <Tabs defaultValue="today" className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Stats />
            <div className="flex gap-8 flex-col md:flex-row">
              <UpcomingEvents />
              <CreateAppointmrnt />
            </div>

            <RecentPatients />
          </div>
        </main>
      </div>
    </div>
  );
}
