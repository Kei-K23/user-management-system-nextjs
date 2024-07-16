import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientProviders from "@/providers/query-client-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "UMS",
    template: `%s | ${"UMS"}`,
  },
  description:
    "User management system with complete Authentication flow and user CRUD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProviders>
          {children}
          <Toaster />
        </QueryClientProviders>
      </body>
    </html>
  );
}
