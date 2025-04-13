"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

type PatientProps = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  medicalHistory: any;
  id: string;
};
export default function PatientsTable({
  patients,
}: {
  patients: PatientProps[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.user.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      patient.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <div className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2 md:w-2/3">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
              Showing <strong>{filteredPatients.length}</strong> of{" "}
              <strong>{patients.length}</strong> patients
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 pt-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {patient.user.firstName.charAt(0).toUpperCase()}
                          {patient.user.lastName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {patient.user.firstName} {patient.user.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{patient.user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
