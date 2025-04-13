import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")

    let patients

    if (doctorId) {
      // Get patients for a specific doctor
      const patientDoctors = await prisma.patientDoctor.findMany({
        where: { doctorId },
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
              medicalHistory: true,
            },
          },
        },
      })

      patients = patientDoctors.map((pd) => pd.patient)
    } else {
      // Get all patients
      patients = await prisma.patient.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          medicalHistory: true,
        },
      })
    }

    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "An error occurred while fetching patients" }, { status: 500 })
  }
}
