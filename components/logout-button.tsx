"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

export function LogoutButton({
  variant = "default",
  className = "",
}: LogoutButtonProps) {
  return (
    <Button
      variant={variant}
      size={"sm"}
      className={cn("w-full", className)}
      onClick={async () => {
        await logout();
      }}
    >
      <LogOut className="w-4 h-4" /> Logout
    </Button>
  );
}
