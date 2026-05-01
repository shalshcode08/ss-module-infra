import { Routes, Route } from "react-router";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
