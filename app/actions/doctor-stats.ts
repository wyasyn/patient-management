"use server";

import { prisma } from "@/lib/db";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  subMonths,
} from "date-fns";
import { getCurrentUser } from "./auth";
import { getDoctorFromUserId } from "./user";

export const getDoctorDashboardStats = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const doctorExists = await getDoctorFromUserId(user.id);
  if (!doctorExists) throw new Error("Doctor not found");
  const doctorId = doctorExists.id;
  const now = new Date();

  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const lastWeekStart = subWeeks(thisWeekStart, 1);
  const lastWeekEnd = subWeeks(thisWeekEnd, 1);

  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = thisMonthStart;

  const [
    totalAppointmentsToday,
    pendingAppointmentsToday,
    thisWeekPatients,
    lastWeekPatients,
    totalPatients,
    lastMonthPatients,
    pendingRecommendations,
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        doctorId,
        startTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
    prisma.appointment.count({
      where: {
        doctorId,
        startTime: {
          gte: todayStart,
          lte: todayEnd,
        },
        status: "PENDING",
      },
    }),
    prisma.patientDoctor.count({
      where: {
        doctorId,
        createdAt: {
          gte: thisWeekStart,
          lte: thisWeekEnd,
        },
      },
    }),
    prisma.patientDoctor.count({
      where: {
        doctorId,
        createdAt: {
          gte: lastWeekStart,
          lte: lastWeekEnd,
        },
      },
    }),
    prisma.patientDoctor.count({
      where: {
        doctorId,
      },
    }),
    prisma.patientDoctor.count({
      where: {
        doctorId,
        createdAt: {
          gte: lastMonthStart,
          lt: lastMonthEnd,
        },
      },
    }),
    prisma.recommendation.count({
      where: {
        doctorId,
        status: "PENDING",
      },
    }),
  ]);

  return {
    appointmentsToday: {
      total: totalAppointmentsToday,
      pending: pendingAppointmentsToday,
    },
    weeklyPatients: {
      thisWeek: thisWeekPatients,
      lastWeek: lastWeekPatients,
      difference: thisWeekPatients - lastWeekPatients,
    },
    monthlyPatients: {
      total: totalPatients,
      lastMonth: lastMonthPatients,
      increaseFromLastMonth: totalPatients - lastMonthPatients,
    },
    recommendations: {
      pending: pendingRecommendations,
    },
  };
};
