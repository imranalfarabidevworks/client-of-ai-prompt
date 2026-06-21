import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "PromptHive — AI Prompt Marketplace",
  description: "Discover, share, and sell AI prompts for ChatGPT, Gemini, Claude, Midjourney and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
