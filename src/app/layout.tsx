import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tomcom - Portfolio | EdgeOne Makers',
  description: 'Deep Learning Engineer & Data Scientist Portfolio · Demo only · EdgeOne Makers',
  keywords: "EdgeOne Makers, Demo only",
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