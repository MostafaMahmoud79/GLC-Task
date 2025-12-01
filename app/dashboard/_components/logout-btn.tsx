"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/server/actions/logout-action";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function LogoutBtn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction();
        setUser(null);
        router.push("/");
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleLogout}
      className="bg-red-500 rounded-md px-3 sm:px-6 md:px-8 py-2 sm:py-2.5 text-white capitalize hover:bg-red-600 active:bg-red-700 transition-all duration-200 cursor-pointer w-full text-xs sm:text-sm md:text-base font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isPending ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="hidden sm:inline">Logging out...</span>
          <span className="sm:hidden">Wait...</span>
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </>
      )}
    </Button>
  );
}