"use client";

import * as React from "react";
import { User } from "lucide-react";

import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signoff } from "@/actions/auth";

export default function UserProfile() {
  const user = useContext(UserContext);
  const router = useRouter();

  const logInorOut = async () => {
    if (user) {
      await signoff();
    }
    router.push("/signin");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.name || "Guest"}</DropdownMenuLabel>
        <DropdownMenuItem onClick={logInorOut}>{user ? "Logout" : "Login"}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
