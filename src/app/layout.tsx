import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weatherly | 반응형 날씨 앱",
  description: "Open-Meteo 기반 현재 날씨, 24시간 예보, 7일 예보",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
