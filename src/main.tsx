import { createRoot } from "react-dom/client";
import App from "./App"
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";

import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </AuthProvider>
);
