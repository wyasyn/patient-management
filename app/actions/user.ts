"use server";

import { prisma } from "@/lib/db";
import { cache } from "react";
import { getCurrentUser } from "./auth";
import { Role } from "@prisma/client";

export const getDoctorFromUserId = async (userId: string) => {
  try {
    const doctorExists = await prisma.doctor.findUnique({
      where: { userId: userId },
    });
    if (!doctorExists) {
      throw new Error("Doctor not found. Please select a valid doctor.");
    }
    return doctorExists;
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw new Error("Failed to fetch doctor");
  }
};

export const getPatientFromUserId = async (userId: string) => {
  try {
    const patientExists = await prisma.patient.findUnique({
      where: { userId: userId },
    });
    if (!patientExists) {
      throw new Error("Patient not found. Please select a valid patient.");
    }
    return patientExists;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw new Error("Failed to fetch patient");
  }
};

export const getCurrentRoleId = cache(async (): Promise<string | undefined> => {
  const user = await getCurrentUser();
  if (!user) return;

  switch (user.role) {
    case Role.DOCTOR:
      const doctor = await prisma.doctor.findUnique({
        where: { userId: user.id },
      });
      return doctor?.id;

    case Role.PATIENT:
      const patient = await prisma.patient.findUnique({
        where: { userId: user.id },
      });
      return patient?.id;

    default:
      console.warn("Unknown role:", user.role);
      return;
  }
});
