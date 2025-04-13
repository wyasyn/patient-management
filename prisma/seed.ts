import {
  PrismaClient,
  Role,
  AppointmentStatus,
  RecommendationStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const doctorEmails = [
  "doc1@example.com",
  "doc2@example.com",
  "doc3@example.com",
];
const patientEmails = [
  "pat1@example.com",
  "pat2@example.com",
  "pat3@example.com",
  "pat4@example.com",
  "pat5@example.com",
];

const specialties = ["Cardiology", "Neurology", "Dermatology"];
const conditions = [
  "Asthma",
  "Diabetes",
  "Hypertension",
  "Anxiety",
  "Migraines",
];
const lifestyleTips = [
  "Drink more water",
  "Walk 30 mins a day",
  "Reduce sugar intake",
  "Practice mindfulness",
];

async function hash(password: string) {
  return await bcrypt.hash(password, 10);
}

// Ensure that `main` is an async function
async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.recommendation.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.patientDoctor.deleteMany(),
    prisma.medicalHistory.deleteMany(),
    prisma.doctor.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create doctors
  const hashedDoctorPassword = await hash("doctor123");
  const doctorUsers = await Promise.all(
    doctorEmails.map((email, index) =>
      prisma.user.create({
        data: {
          email,
          password: hashedDoctorPassword,
          firstName: `DocFirst${index + 1}`,
          lastName: `DocLast${index + 1}`,
          role: Role.DOCTOR,
          doctor: {
            create: {
              specialty: specialties[index % specialties.length],
            },
          },
        },
        include: { doctor: true },
      })
    )
  );

  // Create patients
  const patientUsers = await Promise.all(
    patientEmails.map(async (email, index) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: await hash("patient123"),
          firstName: `PatFirst${index + 1}`,
          lastName: `PatLast${index + 1}`,
          role: Role.PATIENT,
          patient: {
            create: {
              dateOfBirth: new Date(`199${index}-01-01`),
              medicalHistory: {
                create: {
                  allergies: "None",
                  conditions: conditions[index % conditions.length],
                  medications: "Vitamin D",
                  surgeries: "None",
                  familyHistory: "Hypertension",
                },
              },
            },
          },
        },
        include: { patient: { include: { medicalHistory: true } } },
      });

      const doctor = doctorUsers[index % doctorUsers.length].doctor!;
      const patient = user.patient!;

      // Link doctor-patient
      await prisma.patientDoctor.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id,
        },
      });

      // Create appointments
      await prisma.appointment.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id,
          startTime: new Date(`2025-04-${10 + index}T10:00:00Z`),
          endTime: new Date(`2025-04-${10 + index}T10:30:00Z`),
          type: "Consultation",
          status:
            index % 2 === 0
              ? AppointmentStatus.CONFIRMED
              : AppointmentStatus.PENDING,
          notes: `Discussing ${conditions[index % conditions.length]}`,
        },
      });

      // Create recommendations
      await prisma.recommendation.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id,
          type: "Lifestyle",
          description: lifestyleTips[index % lifestyleTips.length],
          status: RecommendationStatus.ACTIVE,
        },
      });

      return user;
    })
  );

  console.log(
    `✅ Seeded ${doctorUsers.length} doctors and ${patientUsers.length} patients successfully.`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
