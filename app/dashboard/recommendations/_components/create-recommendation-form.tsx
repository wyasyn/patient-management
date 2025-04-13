"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRecommendation } from "@/app/actions/recommendation";

interface CreateRecommendationFormProps {
  doctorId: string;
  patients: Array<{
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }>;
}

// Define the action state type
type ActionState = {
  success?: boolean;
  error?: string;
  recommendation?: any;
} | null;

// Common recommendation types
const recommendationTypes = [
  "Medication",
  "Exercise",
  "Diet",
  "Specialist Referral",
  "Follow-up Visit",
  "Lab Test",
  "Therapy",
  "Other",
];

export function CreateRecommendationForm({
  doctorId,
  patients,
}: CreateRecommendationFormProps) {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState("");
  const [recommendationType, setRecommendationType] = useState("");
  const [description, setDescription] = useState("");
  const [customType, setCustomType] = useState("");

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    // Use underscore to indicate intentionally unused parameter
    async (_: ActionState, formData: FormData) => {
      const patientId = formData.get("patientId") as string;
      const type = formData.get("type") as string;
      const description = formData.get("description") as string;

      if (!patientId || !type || !description) {
        return { error: "All fields are required" };
      }

      try {
        const result = await createRecommendation({
          patientId,
          type,
          description,
        });

        if (!result.message) {
          return { error: "Failed to create recommendation" };
        }

        return { success: true, recommendation: result.recommendation };
      } catch (error) {
        return { error: "An unexpected error occurred" };
      }
    },
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("patientId", selectedPatient);
    formData.append(
      "type",
      recommendationType === "Other" ? customType : recommendationType
    );
    formData.append("description", description);

    await formAction(formData);

    if (state && state.success) {
      toast({
        title: "Recommendation created",
        description: "The recommendation has been created successfully",
      });

      // Reset form
      setSelectedPatient("");
      setRecommendationType("");
      setDescription("");
      setCustomType("");

      // Refresh the page to show the new recommendation
      router.refresh();
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Recommendation</CardTitle>
        <CardDescription>
          Create a new recommendation for a patient
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select
              value={selectedPatient}
              onValueChange={setSelectedPatient}
              disabled={pending}
            >
              <SelectTrigger id="patient">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.user.firstName} {patient.user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Recommendation Type</Label>
            <Select
              value={recommendationType}
              onValueChange={setRecommendationType}
              disabled={pending}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {recommendationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {recommendationType === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="customType">Custom Type</Label>
              <Input
                id="customType"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Enter custom recommendation type"
                disabled={pending}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed instructions or information about this recommendation"
              rows={4}
              disabled={pending}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedPatient("");
              setRecommendationType("");
              setDescription("");
              setCustomType("");
            }}
            disabled={pending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Recommendation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
