import React from "react";
import { requireAuth } from "../actions/auth";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth("PATIENT");
  return <>{children}</>;
}
