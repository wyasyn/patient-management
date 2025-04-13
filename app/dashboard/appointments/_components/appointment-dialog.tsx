"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { createAppointment } from "@/app/actions/appointments";
import { useRouter } from "next/navigation";

// Types
type Doctor = {
  id: string;
  firstName: string;
  specialty?: string;
};

type Patient = {
  id: string;
  user: {
    id: string;
    firstName: string;
  };
};

type UserRole = "PATIENT" | "DOCTOR";

type AppointmentType = "CONSULTATION" | "FOLLOW_UP" | "CHECKUP" | "EMERGENCY";

type AppointmentFormData = {
  doctorId: string;
  patientId: string;
  type: AppointmentType;
  notes: string;
  date: Date;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
};

type AppointmentDialogProps = {
  userRole: UserRole;
  userId: string;
  doctors?: Doctor[];
  patients?: Patient[];
  triggerLabel?: string;
};

export default function AppointmentDialog({
  userRole,
  userId,
  doctors = [],
  patients = [],
  triggerLabel = "Schedule Appointment",
}: AppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AppointmentFormData>({
    defaultValues: {
      doctorId: userRole === "DOCTOR" ? userId : "",
      patientId: userRole === "PATIENT" ? userId : "",
      type: "CONSULTATION",
      notes: "",
      startHour: "09",
      startMinute: "00",
      endHour: "09",
      endMinute: "30",
    },
  });

  const watchStartHour = watch("startHour");
  const watchStartMinute = watch("startMinute");

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create Date objects for start and end times
      const startTime = new Date(date!);
      startTime.setHours(
        Number.parseInt(data.startHour),
        Number.parseInt(data.startMinute)
      );

      const endTime = new Date(date!);
      endTime.setHours(
        Number.parseInt(data.endHour),
        Number.parseInt(data.endMinute)
      );

      // Validate that end time is after start time
      if (endTime <= startTime) {
        setError("End time must be after start time");
        setIsSubmitting(false);
        return;
      }

      const result = await createAppointment({
        doctorId: data.doctorId,
        patientId: data.patientId,
        startTime,
        endTime,
        type: data.type,
        notes: data.notes,
      });

      setSuccess(result.message);

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setOpen(false);
        reset(); // Reset form when closing
      }, 1500);

      router.refresh(); // Refresh the page to show the new appointment
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // When start time changes, update end time to be 30 minutes later by default
  const updateEndTime = () => {
    const startHour = Number.parseInt(watchStartHour);
    const startMinute = Number.parseInt(watchStartMinute);

    let endHour = startHour;
    let endMinute = startMinute + 30;

    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }

    setValue("endHour", endHour.toString().padStart(2, "0"));
    setValue("endMinute", endMinute.toString().padStart(2, "0"));
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form and state when dialog closes
      reset();
      setError(null);
      setSuccess(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>
            {userRole === "PATIENT"
              ? "Schedule an appointment with a doctor"
              : "Schedule an appointment with a patient"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Person Selection based on role */}
            {userRole === "PATIENT" && (
              <div className="grid gap-2">
                <Label htmlFor="doctorId">Select Doctor</Label>
                <Select
                  onValueChange={(value) => setValue("doctorId", value)}
                  defaultValue=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.firstName}{" "}
                        {doctor.specialty ? `(${doctor.specialty})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctorId && (
                  <p className="text-sm text-red-500">Please select a doctor</p>
                )}
              </div>
            )}

            {userRole === "DOCTOR" && (
              <div className="grid gap-2">
                <Label htmlFor="patientId">Select Patient</Label>
                <Select
                  onValueChange={(value) => setValue("patientId", value)}
                  defaultValue=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.user.firstName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patientId && (
                  <p className="text-sm text-red-500">
                    Please select a patient
                  </p>
                )}
              </div>
            )}

            {/* Appointment Type */}
            <div className="grid gap-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select
                onValueChange={(value) =>
                  setValue("type", value as AppointmentType)
                }
                defaultValue="CONSULTATION"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONSULTATION">Consultation</SelectItem>
                  <SelectItem value="FOLLOW_UP">Follow-up</SelectItem>
                  <SelectItem value="CHECKUP">Regular Checkup</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="grid gap-2">
              <Label>Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                    }}
                    initialFocus
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Time</Label>
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) => {
                      setValue("startHour", value);
                      updateEndTime();
                    }}
                    defaultValue="09"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>:</span>
                  <Select
                    onValueChange={(value) => {
                      setValue("startMinute", value);
                      updateEndTime();
                    }}
                    defaultValue="00"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["00", "15", "30", "45"].map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>End Time</Label>
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) => setValue("endHour", value)}
                    defaultValue="09"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>:</span>
                  <Select
                    onValueChange={(value) => setValue("endMinute", value)}
                    defaultValue="30"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["00", "15", "30", "45"].map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about the appointment"
                {...register("notes")}
              />
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 p-3 rounded-md text-green-600 text-sm">
                {success}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
