import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '거림 영업 ERP',
  description: '거림 의류 영업 관리 시스템 - 작업지시서 분석, 자재 관리, BOM 처리',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/파비콘.png',
      },
    ],
    apple: '/파비콘.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
