import { Button } from "@/components/ui/button";
import { Google } from "@/components/ui/svgs/google";

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
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
