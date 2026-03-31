import { AuthCardShell } from "@/components/auth/auth-card-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCardShell
      eyebrow="Chào mừng trở lại"
      title="Đăng nhập"
      description="Sử dụng tài khoản REUSE Hub của bạn để tiếp tục khám phá kho đồ cũ chất lượng."
      footerText="Chưa có tài khoản?"
      footerLinkHref="/register"
      footerLinkLabel="Đăng ký ngay"
    >
      <LoginForm />
    </AuthCardShell>
  );
}
