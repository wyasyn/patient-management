"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "./auth";
import { getDoctorFromUserId } from "./user";

export const getRecentPatientsByLastVisit = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }
  const doctorExists = await getDoctorFromUserId(user.id);
  if (!doctorExists) throw new Error("Doctor not found");
  const doctorId = doctorExists.id;

  // Get most recent appointment per patient
  const recentAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
    },
    orderBy: {
      startTime: "desc",
    },
    distinct: ["patientId"],
    include: {
      patient: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  // Map and return simplified patient info
  const recentPatients = recentAppointments.map((appt) => ({
    id: appt.patientId,
    name: `${appt.patient.user.firstName} ${appt.patient.user.lastName}`,
    email: appt.patient.user.email,
    lastVisited: appt.startTime,
  }));

  return recentPatients;
};
