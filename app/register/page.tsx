"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Role } from "@prisma/client";

// Define form schemas outside the component
const doctorSchema = z
  .object({
    role: z.literal(Role.DOCTOR),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    specialty: z.string().min(1, "Specialty is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const patientSchema = z
  .object({
    role: z.literal(Role.PATIENT),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Define types for our form data
type DoctorFormValues = z.infer<typeof doctorSchema>;
type PatientFormValues = z.infer<typeof patientSchema>;
type FormValues = DoctorFormValues | PatientFormValues;

type SearchParams = Promise<{ role?: string }>;

export default function RegisterPage(props: { searchParams: SearchParams }) {
  const router = useRouter();
  const searchParams = use(props.searchParams);
  const newRole = searchParams.role;

  const getInitialRole = (): Role => {
    if (newRole === Role.DOCTOR) {
      return Role.DOCTOR;
    }
    return Role.PATIENT;
  };

  const [role, setRole] = useState<Role>(getInitialRole());
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formSchema = role === Role.DOCTOR ? doctorSchema : patientSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      ...(role === Role.DOCTOR ? { specialty: "" } : { dateOfBirth: "" }),
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { confirmPassword, ...body } = data;

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        role === Role.DOCTOR
          ? router.push("/dashboard")
          : router.push("/patient-portal");
      } else {
        const { error } = await res.json();
        setServerError(error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (newRole: string) => {
    // Convert string to Role enum
    const roleValue = newRole === Role.DOCTOR ? Role.DOCTOR : Role.PATIENT;
    setRole(roleValue);

    // Update form with new role
    form.setValue("role", roleValue);

    // Preserve common fields
    const commonFields = {
      firstName: form.getValues("firstName"),
      lastName: form.getValues("lastName"),
      email: form.getValues("email"),
      password: form.getValues("password"),
      confirmPassword: form.getValues("confirmPassword"),
    };

    // Reset form with appropriate fields for the role
    if (roleValue === Role.DOCTOR) {
      form.reset({
        ...commonFields,
        role: Role.DOCTOR,
        specialty: "",
      } as DoctorFormValues);
    } else {
      form.reset({
        ...commonFields,
        role: Role.PATIENT,
        dateOfBirth: "",
      } as PatientFormValues);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue={role} onValueChange={handleRoleChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={Role.DOCTOR}>Doctor</TabsTrigger>
              <TabsTrigger value={Role.PATIENT}>Patient</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={
                            role === Role.DOCTOR
                              ? "doctor@example.com"
                              : "patient@example.com"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <TabsContent value={Role.DOCTOR} className="mt-0 pt-0">
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialty</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cardiology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value={Role.PATIENT} className="mt-0 pt-0">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    `Register as ${role === Role.DOCTOR ? "Doctor" : "Patient"}`
                  )}
                </Button>
              </form>
            </Form>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm text-gray-600 w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
