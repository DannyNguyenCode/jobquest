import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobQuest",
  description: "JobQuest application foundation",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="caramellatte" className="h-full">
      <body className="flex min-h-full flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
