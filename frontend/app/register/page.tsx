import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthCardShell
      eyebrow="Authentication"
      title="Create account"
      description="Register a marketplace account using the backend auth contract."
      footerText="Already have an account?"
      footerLinkHref="/login"
      footerLinkLabel="Sign in"
    >
      <RegisterForm />
    </AuthCardShell>
  );
}
