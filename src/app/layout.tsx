import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UmamiProvider from 'next-umami'

const inter = Inter({
  subsets: ["latin"],
});

if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error("NEXT_PUBLIC_URL is not set.");
}
if (!process.env.UMAMI_production_ID || !process.env.UMAMI_development_ID) {
  throw new Error("UMAMI_production_ID or UMAMI_development_ID is not set.");
}

const isProd = process.env.NODE_ENV === "production";


export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
            <head>
        <UmamiProvider websiteId={process.env[isProd ? "UMAMI_PRODUCTION_ID" : "UMAMI_DEVELOPMENT_ID"] || ""} src="https://u.ipv4.army/script.js" hostUrl="https://u.ipv4.army" performance={true} />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
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
