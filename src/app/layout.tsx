import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "@/shared/ui/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/shared/providers/QueryProvider";

const lexend = Lexend({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HR Search",
  description: "HR management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // Dark-first, matching the reference design. Toggle by removing this class.
      className={`${lexend.className} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <AuthProvider>{children}</AuthProvider>
            <Toaster position="top-right" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
