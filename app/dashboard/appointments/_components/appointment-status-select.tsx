"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActionState } from "react";
import { toast } from "@/hooks/use-toast";
import { updateAppointmentStatus } from "@/app/actions/appointments";
import { AppointmentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

// Create status options based on the Prisma AppointmentStatus enum
const statusOptions = [
  { value: AppointmentStatus.PENDING, label: "Pending" },
  { value: AppointmentStatus.CONFIRMED, label: "Confirmed" },
  { value: AppointmentStatus.CANCELLED, label: "Cancelled" },
  { value: AppointmentStatus.COMPLETED, label: "Completed" },
];

interface AppointmentStatusSelectProps {
  appointmentId: string;
  initialStatus: AppointmentStatus;
}

// Define the action state type
type ActionState = {
  success?: boolean;
  error?: string;
} | null;

export function AppointmentStatusSelect({
  appointmentId,
  initialStatus,
}: AppointmentStatusSelectProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [status, setStatus] = useState<AppointmentStatus>(initialStatus);

  // Properly implement useActionState with the correct function signature
  const [actionState, formAction, pending] = useActionState<
    ActionState,
    FormData
  >(
    // Properly type the parameters
    async (_: ActionState, formData: FormData) => {
      const newStatus = formData.get("status") as AppointmentStatus;

      try {
        const result = await updateAppointmentStatus(appointmentId, newStatus);
        if (!result) {
          return { error: "Failed to update appointment status" };
        }
        return { success: true };
      } catch (error) {
        return { error: "An unexpected error occurred" };
      }
    },
    // Initial state
    null
  );

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (newStatus === status) return;

    // Create FormData to pass to the action
    const formData = new FormData();
    formData.append("status", newStatus);

    // Execute the action
    await formAction(formData);

    // Check the result from actionState
    if (actionState && actionState.success) {
      setStatus(newStatus);
      toast({
        title: "Status updated",
        description: `Appointment status changed to ${newStatus.toLowerCase()}`,
      });
      router.refresh();
    } else if (actionState && actionState.error) {
      toast({
        title: "Error",
        description: actionState.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={pending}
        >
          {pending
            ? "Updating..."
            : statusOptions.find((option) => option.value === status)?.label ||
              "Select status"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statusOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    handleStatusChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      status === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
