"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DashboardNavItem({
  name,
  link,
  icon,
}: {
  name: string;
  link: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link
      href={link}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium  hover:bg-gray-100",
        isActive ? "text-emerald-900 bg-emerald-50" : "text-gray-900"
      )}
    >
      {icon}
      {name}
    </Link>
  );
}
