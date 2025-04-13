"use server";

import { revalidatePath } from "next/cache";
import { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentRoleId } from "@/app/actions/user";

interface AppointmentData {
  doctorId: string;
  startTime: Date;
  endTime: Date;
  type: string;
  notes?: string;
}

export async function createAppointment(data: AppointmentData) {
  try {
    const patientId = await getCurrentRoleId();

    if (!patientId) {
      return { success: false, error: "Patient profile not found" };
    }

    // Check if the doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: data.doctorId },
    });

    if (!doctor) {
      return { success: false, error: "Doctor not found" };
    }

    // Check for conflicting appointments
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        OR: [
          {
            AND: [
              { startTime: { lte: data.startTime } },
              { endTime: { gt: data.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: data.endTime } },
              { endTime: { gte: data.endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: data.startTime } },
              { endTime: { lte: data.endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      return { success: false, error: "This time slot is already booked" };
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patientId,
        doctorId: data.doctorId,
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
        notes: data.notes,
        status: AppointmentStatus.PENDING,
      },
    });

    // Revalidate the appointments page to show the new appointment
    revalidatePath("/patient-portal");

    return { success: true, appointmentId: appointment.id };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create appointment",
    };
  }
}
