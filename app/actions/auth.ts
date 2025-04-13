"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret_here";
  return new TextEncoder().encode(secret);
};

// Define the user type based on the data stored in the JWT
type User = {
  id: string;
  email: string;
  role: "DOCTOR" | "PATIENT";
  firstName?: string;
  lastName?: string;
};

/**
 * Verifies the authentication token and returns the user information
 * @returns The authenticated user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    // Verify and decode the JWT token
    const { payload } = await jwtVerify(token.value, getJwtSecretKey());

    const userPayload = payload as User;

    return {
      id: userPayload.id,
      email: userPayload.email,
      role: userPayload.role,
      firstName: userPayload.firstName,
      lastName: userPayload.lastName,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

/**
 * Checks if the user is authenticated and has the required role
 * @param requiredRole The role required to access a resource
 * @returns The authenticated user or redirects if not authorized
 */
export async function requireAuth(
  requiredRole?: "DOCTOR" | "PATIENT"
): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on role
    if (user.role === "DOCTOR") {
      redirect("/dashboard");
    } else {
      redirect("/patient-portal");
    }
  }

  return user;
}

/**
 * Logs out the user by clearing the authentication cookie
 */
export async function logout() {
  const cookieStore = await cookies();

  // Delete the token cookie
  cookieStore.delete("token");

  // Redirect to login page
  redirect("/login");
}
