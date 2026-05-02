import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { createClient } from "@/lib/supabase/client";
import AppRoutes from "@/routes";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (!authenticated) return <Navigate to={AppRoutes.LOGIN} replace />;
  return <>{children}</>;
}
