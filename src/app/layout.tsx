import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: [
    {
      path: "../assets/fonts/Pretendard-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Pretendard-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Pretendard-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Pretendard-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Pretendard-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sungsoo Yang Blog",
  description: "Sungsoo Yang Blog",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: {
      rel: "icon",
      url: "/logo.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={`${pretendard.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
