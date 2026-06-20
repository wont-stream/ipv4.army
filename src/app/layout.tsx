import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error("NEXT_PUBLIC_URL is not set.");
} else {
  console.log(`NEXT_PUBLIC_URL is set to ${process.env.NEXT_PUBLIC_URL}`);
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
  title: "S€TH @ IPv4 Army",
  description: "A guy, but a man of few words",
  keywords: [
    "S€TH",
    "Seth",
    "IPv4 Army",
    "portfolio",
    "virtual reality",
    "VR",
    "developer",
  ],
};
