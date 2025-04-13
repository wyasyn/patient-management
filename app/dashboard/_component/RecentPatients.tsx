import { getRecentPatientsByLastVisit } from "@/app/actions/visits";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default async function RecentPatients() {
  const recentPatients = await getRecentPatientsByLastVisit();
  if (!recentPatients || recentPatients.length === 0) {
    return (
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
          <CardDescription>No recent patients found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
        <CardDescription>
          You have seen {recentPatients.length} patients recently
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPatients.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{patient.name}</p>
                  <p className="text-xs text-gray-500">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm">Last visit</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(patient.lastVisited.toISOString())}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Link href="/dashboard/patients">
            <Button variant="outline" size="sm">
              View All Patients
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
