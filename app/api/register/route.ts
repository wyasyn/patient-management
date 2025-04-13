import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  role: z.nativeEnum(Role),
  specialty: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();

  const parseResult = registerSchema.safeParse(body);

  if (!parseResult.success) {
    const errorMessages = parseResult.error.errors.map((e) => e.message);
    return NextResponse.json(
      { error: errorMessages.join(", ") },
      { status: 400 }
    );
  }
  const { email, password, firstName, lastName, role, specialty, dateOfBirth } =
    parseResult.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role === Role.DOCTOR ? Role.DOCTOR : Role.PATIENT,
      },
    });

    if (role === Role.DOCTOR && specialty) {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          specialty,
        },
      });
    } else if (role === Role.PATIENT && dateOfBirth) {
      await prisma.patient.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date(dateOfBirth),
        },
      });
    }

    // Create JWT token
    const token = await new SignJWT({
      id: user.id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(JWT_SECRET));

    const cookieStore = await cookies();

    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "strict",
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
