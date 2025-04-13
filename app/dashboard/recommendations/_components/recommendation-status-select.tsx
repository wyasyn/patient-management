"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { RecommendationStatus } from "@prisma/client";
import { updateRecommendationStatus } from "@/app/actions/recommendation";

// Create status options based on the Prisma RecommendationStatus enum
const statusOptions = [
  { value: RecommendationStatus.ACTIVE, label: "Active" },
  { value: RecommendationStatus.PENDING, label: "Pending" },
  { value: RecommendationStatus.COMPLETED, label: "Completed" },
];

interface RecommendationStatusSelectProps {
  recommendationId: string;
  initialStatus: RecommendationStatus;
}

// Define the action state type
type ActionState = {
  success?: boolean;
  error?: string;
  recommendation?: any;
} | null;

export function RecommendationStatusSelect({
  recommendationId,
  initialStatus,
}: RecommendationStatusSelectProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<RecommendationStatus>(initialStatus);
  const router = useRouter();

  const [actionState, formAction, pending] = useActionState<
    ActionState,
    FormData
  >(async (_: ActionState, formData: FormData) => {
    const newStatus = formData.get("status") as RecommendationStatus;

    try {
      const result = await updateRecommendationStatus(
        recommendationId,
        newStatus
      );
      if (!result.success) {
        return {
          error: result.error || "Failed to update recommendation status",
        };
      }
      return { success: true, recommendation: result.recommendation };
    } catch (error) {
      return { error: "An unexpected error occurred" };
    }
  }, null);

  const handleStatusChange = async (newStatus: RecommendationStatus) => {
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
        description: `Recommendation status changed to ${newStatus.toLowerCase()}`,
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
