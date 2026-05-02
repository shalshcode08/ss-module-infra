import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/ui/PageLoader";
import AppRoutes from "./routes/index.ts";
import { useAuthStore } from "./stores/auth.store";

const LoginPage = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to={AppRoutes.LOGIN} replace />} />
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
        <Route
          path={AppRoutes.HOME}
          element={
            <ProtectedRoute>
              <div>Home</div>
            </ProtectedRoute>
          }
        />
        <Route path={AppRoutes.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
