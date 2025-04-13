import React from "react";
import AppointmentDialog from "./appointment-dialog";
import { getCurrentUser } from "@/app/actions/auth";
import { getPatients } from "@/app/actions/patients";
import { getDoctorFromUserId } from "@/app/actions/user";

export default async function DoctorCreateAppointment() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");
  const patients = await getPatients();
  if (!patients) throw new Error("No patients found");
  if (user.role !== "DOCTOR") throw new Error("User is not authorized");
  const doctorId = (await getDoctorFromUserId(user.id)).id;
  return (
    <AppointmentDialog
      userRole="DOCTOR"
      userId={doctorId}
      patients={patients}
      triggerLabel="Schedule Patient Visit"
    />
  );
}
