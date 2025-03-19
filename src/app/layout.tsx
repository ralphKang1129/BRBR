import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AuthProvider from "./contexts/AuthContext";
import AuthMenu from "./components/AuthMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "배드민턴 코트 예약 시스템",
  description: "배드민턴 코트를 쉽고 빠르게 예약할 수 있는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center">
                  <Link href="/" className="text-lg font-semibold text-blue-600">배드민턴 예약</Link>
                </div>
                <nav className="flex items-center">
                  <ul className="flex space-x-8 mr-4">
                    <li><Link href="/courts" className="text-gray-600 hover:text-blue-600">코트 찾기</Link></li>
                    <li><Link href="/my-bookings" className="text-gray-600 hover:text-blue-600">내 예약</Link></li>
                  </ul>
                  <AuthMenu />
                </nav>
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
          <footer className="bg-white mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex space-x-6 md:order-2">
                  <Link href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">이용약관</span>
                    이용약관
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">개인정보처리방침</span>
                    개인정보처리방침
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">고객센터</span>
                    고객센터
                  </Link>
                </div>
                <div className="mt-8 md:mt-0 md:order-1">
                  <p className="text-center text-base text-gray-400">
                    &copy; 2024 배드민턴 예약. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
