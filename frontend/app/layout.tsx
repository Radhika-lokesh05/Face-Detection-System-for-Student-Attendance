import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Face Recognition System",
  description: "Full-stack Flask + Next.js Face Recognition App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        {children}
        
        {/* Footer */}
        <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-auto">
          &copy; {new Date().getFullYear()} Face Recognition System. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
