import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCardShell
      eyebrow="Authentication"
      title="Sign in"
      description="Use your existing marketplace account credentials to continue."
      footerText="Need an account?"
      footerLinkHref="/register"
      footerLinkLabel="Create one"
    >
      <LoginForm />
    </AuthCardShell>
  );
}
