import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_TC({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "聊天軍師 Chat Wingman｜讓每段對話都有下一句",
  description: "不離開聊天室，點一下就能讀懂氣氛、找到話題。你的 AI 聊天軍師，隨時陪你把話好好說下去。",
  icons: {
    icon: "/chat-wingman-icon.png",
    shortcut: "/chat-wingman-icon.png",
    apple: "/chat-wingman-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body className={notoSans.variable}>{children}</body>
    </html>
  );
}
