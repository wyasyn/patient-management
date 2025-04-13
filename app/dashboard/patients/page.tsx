import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ChevronLeft, Plus } from "lucide-react";
import PatientsTable from "./_components/patients-table";
import { getPatients } from "@/app/actions/patients";
import { AddPatientDialog } from "./_components/add-patient-dialog";
import { getCurrentUser } from "@/app/actions/auth";

export default async function PatientsPage() {
  const patients = await getPatients();
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex items-center justify-center flex-1 p-4 text-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }
  const doctorId = user.id;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Patients</h1>
        </div>
        <div className="flex items-center gap-2">
          <AddPatientDialog doctorId={doctorId} />
        </div>
      </div>

      {patients && patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
          <h2 className="text-lg font-semibold">No patients found</h2>
          <p className="mt-2 text-sm text-gray-500">
            You don't have any patients yet. Click the button above to add a new
            patient.
          </p>
        </div>
      ) : patients && patients.length > 0 ? (
        <div>
          <PatientsTable patients={patients} />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 p-4 text-center">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
}
