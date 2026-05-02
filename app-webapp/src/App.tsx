import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import PageLoader from "./components/ui/PageLoader";
import AppRoutes from "./routes/app-routes.ts";
import { useAuthStore } from "./stores/auth.store";
import { useConfigStore } from "./stores/config.store";
import HomePage from "./pages/Home.tsx";

const LoginPage = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RootRedirect() {
  const status = useAuthStore((state) => state.status);
  if (status === "idle" || status === "loading") return <PageLoader />;
  if (status === "authenticated") return <Navigate to={AppRoutes.HOME} replace />;
  return <Navigate to={AppRoutes.LOGIN} replace />;
}

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const authStatus = useAuthStore((state) => state.status);
  const fetchConfig = useConfigStore((state) => state.fetchConfig);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
        <Route
          path={AppRoutes.HOME}
          element={
            <ProtectedRoute>
              <AppLayout>
                <HomePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path={AppRoutes.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
