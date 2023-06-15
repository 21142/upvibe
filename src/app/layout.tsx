import "@/styles/globals.css";

export const metadata = {
  title: "upvibe",
  description: "A Reddit like app built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
