import type { ReactNode } from "react";

export const metadata = {
  title: "PharmacoPilot Agent Gateway",
  description: "Server-side external agent gateway demo for PharmacoPilot.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
