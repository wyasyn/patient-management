"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "./auth";
import type { MedicalHistory, User as PrismaUser } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

type PatientWithDetails = {
  id: string;
  user: Pick<PrismaUser, "id" | "firstName" | "lastName" | "email">;
  medicalHistory: MedicalHistory | null;
};

export const getPatients = async (): Promise<PatientWithDetails[]> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (user.role !== "DOCTOR") {
    throw new Error("User is not authorized");
  }

  const doctorExists = await prisma.doctor.findUnique({
    where: { userId: user.id },
  });

  if (!doctorExists) {
    throw new Error("Doctor not found. Please select a valid doctor.");
  }

  try {
    const patients = await prisma.patientDoctor.findMany({
      where: { doctorId: doctorExists.id },
      select: {
        patient: {
          select: {
            id: true,
            medicalHistory: true,
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

    return patients.map((pd) => pd.patient);
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw new Error("Failed to fetch patients");
  }
};

export const getDoctorsBasicInfo = async () => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
          },
        },
      },
    });

    return doctors.map((doctor) => ({
      id: doctor.user.id,
      firstName: doctor.user.firstName,
      specialty: doctor.specialty,
    }));
  } catch (error) {
    console.error("Error fetching doctors' info:", error);
    throw new Error("An error occurred while fetching doctors");
  }
};

interface CreatePatientData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  doctorId: string;
}
export async function createPatient(data: CreatePatientData) {
  const { email, password, firstName, lastName, dateOfBirth, doctorId } = data;

  // Hash the password
  const hashedPassword = await hashPassword(password);

  const doctorExists = await prisma.doctor.findUnique({
    where: { userId: doctorId },
  });

  if (!doctorExists) {
    throw new Error("Doctor not found. Please select a valid doctor.");
  }

  // Use a transaction to ensure all operations succeed or fail together
  return prisma.$transaction(async (tx) => {
    // 1. Create the user with PATIENT role
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "PATIENT",
      },
    });

    // 2. Create the patient record linked to the user
    const patient = await tx.patient.create({
      data: {
        userId: user.id,
        dateOfBirth,
      },
    });

    // 3. Create the association between patient and doctor
    await tx.patientDoctor.create({
      data: {
        patientId: patient.id,
        doctorId: doctorExists.id,
      },
    });

    return { user, patient };
  });
}
