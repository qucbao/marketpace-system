"use client";

import { useAuth } from "@/hooks/use-auth";
import { UserDropdown } from "./user-dropdown";

export function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-end border-b border-border bg-white px-6">
      <div className="flex items-center gap-4">
        {user ? <UserDropdown user={user} logout={logout} /> : null}
      </div>
    </header>
  );
}
