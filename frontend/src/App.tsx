import { useEffect, useState } from "react";
import { WalletProvider } from "./context/WalletProvider";
import { Home } from "./pages/Home";
import { LandingPage } from "./pages/LandingPage";
import { isDashboardRoute } from "./utils/routes";
import "./App.css";
import "./landing.css";

export default function App() {
  const [dashboard, setDashboard] = useState(() => isDashboardRoute(window.location.pathname, window.location.hash));
  useEffect(() => {
    const navigate = () => setDashboard(isDashboardRoute(window.location.pathname, window.location.hash));
    window.addEventListener("hashchange", navigate);
    window.addEventListener("popstate", navigate);
    return () => {
      window.removeEventListener("hashchange", navigate);
      window.removeEventListener("popstate", navigate);
    };
  }, []);
  return <WalletProvider>{dashboard ? <Home /> : <LandingPage />}</WalletProvider>;
}
