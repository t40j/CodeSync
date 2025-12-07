import "./globals.css";

export const metadata = {
  title: "CodeSync",
  description: "Real-time collaborative coding prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  );
}
