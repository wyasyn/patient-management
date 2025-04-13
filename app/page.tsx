import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role } from "@prisma/client";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-emerald-500"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="text-xl font-bold">MediCare</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Modern Patient Management System
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Streamline your healthcare practice with our comprehensive patient
              management solution. Book appointments, manage patient records,
              and share recommendations all in one place.
            </p>
            <div className="flex justify-center gap-4">
              <Link href={`/register?role=${Role.DOCTOR}`}>
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  For Doctors
                </Button>
              </Link>
              <Link href={`/register?role=${Role.DOCTOR}`}>
                <Button size="lg" variant="outline">
                  For Patients
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Key Features
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Management</CardTitle>
                  <CardDescription>
                    Comprehensive patient record management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Easily manage patient profiles, medical history, and contact
                    information in one secure location.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Booking</CardTitle>
                  <CardDescription>
                    Streamlined scheduling system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Allow patients to book appointments online and manage your
                    availability with an intuitive calendar interface.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Medical Recommendations</CardTitle>
                  <CardDescription>
                    Clear communication with patients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Share and track medical recommendations, prescriptions, and
                    follow-up instructions with your patients.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} MediCare Patient Management System. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
