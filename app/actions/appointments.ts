"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "./auth";
import { getDoctorFromUserId } from "./user";
import { AppointmentStatus } from "@prisma/client";

export const createAppointment = async ({
  patientId,
  doctorId,
  startTime,
  endTime,
  type,
  notes,
}: {
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  type: string;
  notes: string;
}) => {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        startTime,
        endTime,
        type,
        notes,
      },
    });
    return {
      appointment,
      message: "Appointment created successfully",
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("An error occurred while creating the appointment");
  }
};

export const getDoctorAppointments = async () => {
  const doctor = await getCurrentUser();
  if (!doctor) throw new Error("User not found");

  const doctorExists = await getDoctorFromUserId(doctor.id);
  if (!doctorExists) throw new Error("Doctor not found");

  return await prisma.appointment.findMany({
    where: { doctorId: doctorExists.id },
    include: {
      patient: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { startTime: "asc" },
  });
};

export const getDoctorRecentAppointments = async () => {
  const doctor = await getCurrentUser();
  if (!doctor) throw new Error("User not found");

  const doctorExists = await getDoctorFromUserId(doctor.id);
  if (!doctorExists) throw new Error("Doctor not found");

  return await prisma.appointment.findMany({
    where: { doctorId: doctorExists.id },
    include: {
      patient: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { startTime: "desc" },
    take: 5,
  });
};

export const getPatientAppointments = async () => {
  const patient = await getCurrentUser();
  if (!patient) throw new Error("User not found");

  const patientExists = await prisma.patient.findUnique({
    where: { userId: patient.id },
  });
  if (!patientExists) throw new Error("Patient not found");

  return await prisma.appointment.findMany({
    where: { patientId: patientExists.id },
    include: {
      doctor: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { startTime: "asc" },
  });
};

export const getPatientRecentAppointments = async () => {
  const patient = await getCurrentUser();
  if (!patient) throw new Error("User not found");

  const patientExists = await prisma.patient.findUnique({
    where: { userId: patient.id },
  });
  if (!patientExists) throw new Error("Patient not found");

  return await prisma.appointment.findMany({
    where: { patientId: patientExists.id },
    include: {
      doctor: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { startTime: "desc" },
    take: 5,
  });
};

export const getUpcomingAppointmentsFromTodayOnwards = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  if (!user) throw new Error("User not found");

  const doctorExists = await getDoctorFromUserId(user.id);
  if (!doctorExists) throw new Error("Doctor not found");

  const today = new Date();

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorExists.id,
        startTime: {
          gte: today,
        },
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      patientName: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
      appointmentDate: appointment.startTime,
      status: appointment.status,
    }));
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    throw new Error("An error occurred while fetching upcoming appointments");
  }
};

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: AppointmentStatus
) {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
    });

    return updatedAppointment;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return null;
  }
}
