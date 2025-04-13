"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function cancelAppointment(appointmentId: string) {
  try {
    // Check if the appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return { success: false, error: "Appointment not found" };
    }

    // Check if the appointment is already cancelled
    if (appointment.status === AppointmentStatus.CANCELLED) {
      return { success: false, error: "Appointment is already cancelled" };
    }

    // Check if the appointment is in the past
    if (appointment.startTime < new Date()) {
      return { success: false, error: "Cannot cancel past appointments" };
    }

    // Update the appointment status to cancelled
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });

    // Revalidate the patient portal page to show the updated appointment
    revalidatePath("/patient-portal");

    return { success: true };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to cancel appointment",
    };
  }
}
