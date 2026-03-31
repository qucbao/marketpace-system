"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { authApi } from "@/lib/api";
import type { ApiResponse, AuthResponse, RegisterRequest } from "@/types";
import { Button, FormField, FormLabel, FormMessage, Input } from "@/components/ui";

type RegisterField = keyof RegisterRequest;
type RegisterErrors = Partial<Record<RegisterField, string>>;

const initialValues: RegisterRequest = {
  fullName: "",
  email: "",
  password: "",
};

function validate(values: RegisterRequest): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (values.fullName.trim().length > 100) {
    errors.fullName = "Full name must be at most 100 characters";
  }

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

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [values, setValues] = useState<RegisterRequest>(initialValues);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField(field: RegisterField, value: string) {
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
      const payload: ApiResponse<AuthResponse> = await authApi.register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      login(payload.data);
      toast.success("Account created successfully! Welcome to the marketplace.");
      router.push("/");
      router.refresh();
    } catch {
      const message = "Registration failed. Email might already be in use.";
      setApiError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <FormField>
        <FormLabel htmlFor="register-full-name">Full name</FormLabel>
        <Input
          id="register-full-name"
          value={values.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          aria-invalid={Boolean(errors.fullName)}
          placeholder="Jane Doe"
          disabled={loading}
        />
        {errors.fullName ? <FormMessage className="text-red-500">{errors.fullName}</FormMessage> : null}
      </FormField>

      <FormField>
        <FormLabel htmlFor="register-email">Email</FormLabel>
        <Input
          id="register-email"
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          placeholder="you@example.com"
          disabled={loading}
        />
        {errors.email ? <FormMessage className="text-red-500">{errors.email}</FormMessage> : null}
      </FormField>

      <FormField>
        <FormLabel htmlFor="register-password">Password</FormLabel>
        <Input
          id="register-password"
          type="password"
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          aria-invalid={Boolean(errors.password)}
          placeholder="Min. 6 characters"
          disabled={loading}
        />
        {errors.password ? <FormMessage className="text-red-500">{errors.password}</FormMessage> : null}
      </FormField>

      {apiError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {apiError}
        </div>
      ) : null}

      <Button type="submit" className="mt-2 h-11 w-full" isLoading={loading}>
        Create account
      </Button>
    </form>
  );
}
