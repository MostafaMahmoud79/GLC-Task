"use client";

import { useForm } from "react-hook-form";
import { Mail, LockKeyhole, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/server/actions/login-action";
import { Form } from "@/components/ui/form";
import clsx from "clsx";
import CustomInputField from "./custom-input-field";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setError("");
    setIsLoading(true);

    try {
      const response = await loginAction(values);
      
      if (response.status === "success") {
        setUser(response.user);
        router.replace("/dashboard");
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-shake">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-9 w-full">
          <div className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <CustomInputField
              control={form.control}
              name="email"
              placeholder="email (try: admin@example.com)"
              icon={<Mail className="size-5 sm:size-6 text-[#1A1A1E]" />}
              disabled={isLoading}
            />

            {/* Password Input */}
            <div className="relative">
              <CustomInputField
                type={showPassword ? "text" : "password"}
                control={form.control}
                name="password"
                placeholder="password"
                icon={<LockKeyhole className="size-5 sm:size-6 text-[#1A1A1E]" />}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition z-10"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={clsx(
              "rounded-[8px] text-white w-full py-2.5 sm:py-3 px-4 sm:px-5 capitalize",
              "bg-[#9414FF] hover:bg-[#7d0fe6] transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2",
              "text-sm sm:text-base font-medium",
              "shadow-lg hover:shadow-xl"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Demo Accounts Info */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Demo Accounts:
            </p>
            <div className="space-y-1.5 sm:space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-gray-600 font-medium">admin@example.com</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] sm:text-xs w-fit">
                  Admin
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-gray-600 font-medium">manager@example.com</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] sm:text-xs w-fit">
                  Project Manager
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-gray-600 font-medium">dev@example.com</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] sm:text-xs w-fit">
                  Developer
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <p className="text-gray-500 text-[10px] sm:text-xs">
                  Password for all: <span className="font-semibold text-gray-700">123456</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}