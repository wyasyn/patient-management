import { compare, hash } from "bcryptjs"
import type { Role } from "@prisma/client"

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

export function isDoctor(role: Role): boolean {
  return role === "DOCTOR"
}

export function isPatient(role: Role): boolean {
  return role === "PATIENT"
}
