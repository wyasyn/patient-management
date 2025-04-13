import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PatientPortalHeader } from "./components/patient-portal-header";
import { SummaryCards } from "./components/summary-cards";
import { PatientPortalTabs } from "./components/patient-portal-tabs";
import { LoadingSkeleton } from "./components/loading-skeleton";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "../actions/auth";
import { PatientPortalFooter } from "./components/patien-portal-footer";

export default async function PatientPortalPage() {
  const user = await getCurrentUser();

  if (!user) return;

  // Find the patient associated with the current user
  const patient = await prisma.patient.findUnique({
    where: { userId: user.id },
    include: {
      user: true,
      doctors: {
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
        },
      },
      appointments: {
        where: {
          startTime: {
            gte: new Date(),
          },
        },
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
        take: 5,
      },
      recommendations: {
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
      medicalHistory: true,
    },
  });

  if (!patient) {
    redirect("/onboarding");
  }

  // Format the patient data for the client components
  const patientInfo = {
    id: patient.id,
    name: `${patient.user.firstName} ${patient.user.lastName}`,
    email: patient.user.email,
    dateOfBirth: patient.dateOfBirth.toISOString().split("T")[0],
    primaryDoctor:
      patient.doctors.length > 0
        ? `Dr. ${patient.doctors[0].doctor.user.firstName} ${patient.doctors[0].doctor.user.lastName}`
        : "No primary doctor assigned",
    primaryDoctorId:
      patient.doctors.length > 0 ? patient.doctors[0].doctorId : null,
    primaryDoctorEmail:
      patient.doctors.length > 0 ? patient.doctors[0].doctor.user.email : "",
  };

  // Format appointments
  const appointments = patient.appointments.map((appointment) => ({
    id: appointment.id,
    doctor: `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
    doctorId: appointment.doctorId,
    specialty: appointment.doctor.specialty,
    date: appointment.startTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: appointment.startTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    type: appointment.type,
    status: appointment.status.toLowerCase(),
    notes: appointment.notes,
  }));

  // Format recommendations
  const recommendations = patient.recommendations.map((rec) => ({
    id: rec.id,
    doctor: `Dr. ${rec.doctor.user.firstName} ${rec.doctor.user.lastName}`,
    doctorId: rec.doctorId,
    type: rec.type,
    description: rec.description,
    date: rec.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    status: rec.status.toLowerCase(),
  }));

  // Get next appointment if available
  const nextAppointment =
    appointments.length > 0
      ? `${appointments[0].date} at ${appointments[0].time}`
      : "No upcoming appointments";

  return (
    <div className="flex min-h-screen flex-col">
      <PatientPortalHeader patientName={patientInfo.name} />

      <main className="flex-1 bg-gray-50 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Patient Portal</h1>
            <p className="text-gray-600">Welcome back, {patientInfo.name}</p>
          </div>

          <Suspense fallback={<LoadingSkeleton />}>
            <SummaryCards
              nextAppointment={nextAppointment}
              doctorName={patientInfo.primaryDoctor}
              recommendationsCount={recommendations.length}
              primaryDoctorEmail={patientInfo.primaryDoctorEmail}
            />

            <PatientPortalTabs
              appointments={appointments}
              recommendations={recommendations}
              patientInfo={patientInfo}
            />
          </Suspense>
        </div>
      </main>

      <PatientPortalFooter />
    </div>
  );
}
