import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AppRoutes from "./routes/index.ts";

function App() {
  return (
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
  );
}

export default App;
