import { Suspense } from "react";
import { PageHeader } from "./components/page-header";
import { AppointmentForm } from "./components/appointment-form";
import { LoadingDoctors } from "./components/loading-doctors";
import { prisma } from "@/lib/db";

export default async function BookAppointmentPage() {
  // Fetch doctors from the database directly in the server component
  const doctors = await prisma.doctor.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // Format the doctors data for the client component
  const formattedDoctors = doctors.map((doctor) => ({
    id: doctor.id,
    name: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
    specialty: doctor.specialty,
  }));

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <PageHeader />

      <Suspense fallback={<LoadingDoctors />}>
        <AppointmentForm doctors={formattedDoctors} />
      </Suspense>
    </div>
  );
}
