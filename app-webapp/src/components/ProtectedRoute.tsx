import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";
import AppRoutes from "@/routes/app-routes";
import PageLoader from "@/components/ui/PageLoader";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((state) => state.status);

  if (status === "idle" || status === "loading") return <PageLoader />;
  if (status === "unauthenticated") return <Navigate to={AppRoutes.LOGIN} replace />;
  return <>{children}</>;
}
