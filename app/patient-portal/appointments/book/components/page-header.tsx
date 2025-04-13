import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function PageHeader() {
  return (
    <div className="mb-6 flex items-center gap-2">
      <Link href="/patient-portal/appointments">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>
      <h1 className="text-2xl font-bold">Book an Appointment</h1>
    </div>
  );
}
