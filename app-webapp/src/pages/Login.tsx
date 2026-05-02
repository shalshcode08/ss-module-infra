import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Provider } from "@supabase/supabase-js";

const LoginPage = () => {
  const supabase = createClient();

  const handleLogin = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        // We'll handle redirects in a top-level router later if needed
        // For now, we'll rely on the default behavior or a simple callback
        // Note: The 'redirectTo' option can be used to specify a custom return URL
      },
    });
  };

  return (
    <div>
      <Button>Login With Google</Button>
    </div>
  );
};

export default LoginPage;
