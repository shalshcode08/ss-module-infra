import { Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Google } from "@/components/ui/svgs/google";
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
    <div>
      <Button onClick={handleLogin} variant="outline">
        <Google />
        Login With Google
      </Button>
    </div>
  );
};

export default LoginPage;
