import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider, ThemeProvider } from "@/lib/Providers";
import { SideNavbar } from "@/components/ui/custom/SideNavbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "MangoMix - like spotify shuffle but better",
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
        <body
          className={`font-sans ${inter.variable} flex min-h-screen items-center justify-center bg-bw p-4`}
        >
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <QueryProvider>
              <div className="flex aspect-[16/10] max-h-[95vh] w-[1400px] max-w-[95vw] overflow-hidden rounded-base bg-bg p-0 shadow-[10px_10px_0_0_#000] outline outline-4 outline-border">
                <SideNavbar />
                <div className="flex-1 overflow-auto p-6">{children}</div>
                <Toaster />
              </div>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
