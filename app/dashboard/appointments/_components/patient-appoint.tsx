import React from "react";
import AppointmentDialog from "./appointment-dialog";
import { getCurrentUser } from "@/app/actions/auth";
import { getDoctorsBasicInfo } from "@/app/actions/patients";

export default async function PatientAppointment() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (user.role !== "PATIENT") {
    throw new Error("User is not authorized");
  }

  const doctors = await getDoctorsBasicInfo();
  return (
    <>
      <AppointmentDialog
        userRole="PATIENT"
        userId="patient-1"
        doctors={doctors}
        triggerLabel="Book Appointment"
      />
    </>
  );
}
