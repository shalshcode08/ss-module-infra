import { Navigate } from "react-router";
import { Google } from "@/components/ui/svgs/google";
import { AppLogo } from "@/components/ui/svgs/appLogo";
import { useAuthStore } from "@/stores/auth.store";
import AppRoutes from "@/routes/app-routes";
import API_ROUTES from "@/routes/api-routes";
import PageLoader from "@/components/ui/PageLoader";

const LoginPage = () => {
  const status = useAuthStore((state) => state.status);

  if (status === "idle" || status === "loading") return <PageLoader />;
  if (status === "authenticated") return <Navigate to={AppRoutes.HOME} replace />;

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}${API_ROUTES.AUTH_GOOGLE}`;
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-slate-50">
      {/* Atmospheric blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 h-[420px] w-[420px] rounded-full bg-indigo-200/50 blur-[110px]" />
        <div className="absolute -bottom-20 -left-20 h-[340px] w-[340px] rounded-full bg-violet-200/40 blur-[90px]" />
        <div className="absolute top-1/3 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-100/60 blur-[60px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #a5b4fc 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
        }}
      />

      <div className="relative flex w-full max-w-[300px] flex-col items-center gap-9">
        <AppLogo size={54} />

        <div className="w-full space-y-3">
          <p className="text-center text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
            Sign in to continue
          </p>
          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-150 hover:border-slate-300 hover:bg-white hover:shadow-md active:scale-[0.98]"
          >
            <Google className="h-4 w-4 shrink-0" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
