import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "My To-do List",
  description: "Online to-do list with Supabase auth",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${prompt.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
