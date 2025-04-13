"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "./auth";
import { getDoctorFromUserId } from "./user";
import { RecommendationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createRecommendation = async (data: {
  patientId: string;
  type: string;
  description: string;
}) => {
  const { patientId, type, description } = data;
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }
  const doctorExists = await getDoctorFromUserId(user.id);
  if (!doctorExists) throw new Error("Doctor not found");
  const doctorId = doctorExists.id;

  try {
    const recommendation = await prisma.recommendation.create({
      data: {
        patientId,
        doctorId,
        type,
        description,
        status: "ACTIVE",
      },
    });

    return {
      recommendation,
      message: "Recommendation created successfully",
    };
  } catch (error) {
    console.error("Error creating recommendation:", error);
    throw new Error("An error occurred while creating the recommendation");
  }
};

export const getRecommendations = async (data: {
  patientId?: string;
  status?: string;
  type: "made" | "received"; // 'made' for doctor-created, 'received' for patient-received
}) => {
  const { patientId, status, type } = data;

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const doctorExists = await getDoctorFromUserId(user.id);
  if (!doctorExists) throw new Error("Doctor not found");
  const doctorId = doctorExists.id;

  try {
    const where: any = {};

    // If the user is a doctor and wants to see the recommendations they've made
    if (type === "made") {
      where.doctorId = doctorId;
    }
    // If the user is a patient and wants to see the recommendations they've received
    if (type === "received" && patientId) {
      where.patientId = patientId;
    }

    if (status) where.status = status;

    const recommendations = await prisma.recommendation.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw new Error("An error occurred while fetching recommendations");
  }
};

export async function updateRecommendationStatus(
  recommendationId: string,
  newStatus: RecommendationStatus
) {
  try {
    // Validate that the status is valid
    if (!Object.values(RecommendationStatus).includes(newStatus)) {
      return {
        success: false,
        error: "Invalid recommendation status",
      };
    }

    const updatedRecommendation = await prisma.recommendation.update({
      where: {
        id: recommendationId,
      },
      data: {
        status: newStatus,
      },
    });

    revalidatePath("/dashboard/recommendations");

    return { success: true, recommendation: updatedRecommendation };
  } catch (error) {
    console.error("Error updating recommendation status:", error);
    return { success: false, error: "Failed to update recommendation status" };
  }
}

export async function getRecommendationsByDoctor() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const doctorExists = await getDoctorFromUserId(user.id);
  if (!doctorExists) throw new Error("Doctor not found");
  const doctorId = doctorExists.id;
  try {
    const recommendations = await prisma.recommendation.findMany({
      where: {
        doctorId,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, recommendations };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { success: false, error: "Failed to fetch recommendations" };
  }
}
