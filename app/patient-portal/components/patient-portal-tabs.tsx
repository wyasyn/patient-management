"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { AppointmentDetails } from "./appointment-details";

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

interface Recommendation {
  id: string;
  doctor: string;
  doctorId: string;
  type: string;
  description: string;
  date: string;
  status: string;
}

interface PatientInfo {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  primaryDoctor: string;
  primaryDoctorId: string | null;
}

interface PatientPortalTabsProps {
  appointments: Appointment[];
  recommendations: Recommendation[];
  patientInfo: PatientInfo;
}

export function PatientPortalTabs({
  appointments,
  recommendations,
  patientInfo,
}: PatientPortalTabsProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  return (
    <div className="mt-6">
      <Tabs defaultValue="appointments">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
              <CardDescription>
                View and manage your upcoming appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAppointment ? (
                <AppointmentDetails
                  appointment={selectedAppointment}
                  onBack={() => setSelectedAppointment(null)}
                />
              ) : (
                <>
                  <div className="space-y-4">
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                              <CalendarDays className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {appointment.doctor}
                              </p>
                              <p className="text-sm text-gray-500">
                                {appointment.specialty}
                              </p>
                              <p className="text-sm text-gray-500">
                                {appointment.date} at {appointment.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {appointment.status === "confirmed"
                                ? "Confirmed"
                                : appointment.status === "pending"
                                ? "Pending"
                                : appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setSelectedAppointment(appointment)
                              }
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed p-8 text-center">
                        <h3 className="mb-2 text-lg font-medium">
                          No appointments scheduled
                        </h3>
                        <p className="mb-4 text-sm text-gray-500">
                          You don't have any upcoming appointments. Book one now
                          to get started.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Link href="/patient-portal/appointments/book">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Book New Appointment
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Recommendations</CardTitle>
              <CardDescription>
                Medical recommendations from your doctors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec) => (
                    <div key={rec.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{rec.type}</Badge>
                          <span className="text-sm text-gray-500">
                            {rec.date}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {rec.doctor}
                        </span>
                      </div>
                      <p className="text-sm">{rec.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">
                      No recommendations yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      You don't have any recommendations from your doctors yet.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p>{patientInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{patientInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </p>
                    <p>{patientInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Primary Doctor
                    </p>
                    <p>{patientInfo.primaryDoctor}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/patient-portal/profile/edit">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
