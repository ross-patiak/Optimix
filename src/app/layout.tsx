import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/lib/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "optimix - like spotify shuffle but better",
  description: "like spotify shuffle but better",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`dark font-sans ${inter.variable}`}>
          <QueryProvider>{children}</QueryProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
