"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { authApi } from "@/lib/api";
import type { ApiResponse, AuthResponse, LoginRequest } from "@/types";
import { Button, FormField, FormLabel, FormMessage, Input } from "@/components/ui";

type LoginField = keyof LoginRequest;
type LoginErrors = Partial<Record<LoginField, string>>;

const initialValues: LoginRequest = {
  email: "",
  password: "",
};

function validate(values: LoginRequest): LoginErrors {
  const errors: LoginErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Email must be valid";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [values, setValues] = useState<LoginRequest>(initialValues);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField(field: LoginField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setApiError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const payload: ApiResponse<AuthResponse> = await authApi.login({
        email: values.email.trim(),
        password: values.password,
      });

      login(payload.data);
      toast.success(`Welcome back, ${payload.data.fullName}!`);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      const message = error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setApiError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <FormField>
        <FormLabel htmlFor="login-email">Email</FormLabel>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          placeholder="email@example.com"
          disabled={loading}
          className="h-12 border-slate-200 focus:ring-primary shadow-sm rounded-xl"
        />
        {errors.email ? <FormMessage className="text-red-500 text-xs font-semibold mt-1">{errors.email}</FormMessage> : null}
      </FormField>

      <FormField>
        <FormLabel htmlFor="login-password">Password</FormLabel>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          aria-invalid={Boolean(errors.password)}
          placeholder="Enter your password"
          disabled={loading}
        />
        {errors.password ? <FormMessage className="text-red-500">{errors.password}</FormMessage> : null}
      </FormField>

      {apiError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-bold animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></div>
          {apiError}
        </div>
      ) : null}

      <Button type="submit" className="h-12 w-full rounded-xl font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" isLoading={loading}>
        Đăng nhập ngay
      </Button>
    </form>
  );
}
