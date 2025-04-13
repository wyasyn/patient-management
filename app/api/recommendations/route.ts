import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")
    const patientId = searchParams.get("patientId")
    const status = searchParams.get("status")

    const where: any = {}

    if (doctorId) where.doctorId = doctorId
    if (patientId) where.patientId = patientId
    if (status) where.status = status

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
    })

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "An error occurred while fetching recommendations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, doctorId, type, description } = body

    const recommendation = await prisma.recommendation.create({
      data: {
        patientId,
        doctorId,
        type,
        description,
        status: "ACTIVE",
      },
    })

    return NextResponse.json(recommendation, { status: 201 })
  } catch (error) {
    console.error("Error creating recommendation:", error)
    return NextResponse.json({ error: "An error occurred while creating the recommendation" }, { status: 500 })
  }
}
