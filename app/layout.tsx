import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google"
import "./globals.css"

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
})

// Load Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["500", "600", "700"],
})

// Load JetBrains Mono font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Instagram Bot Dashboard",
  description: "Monitor and manage your Instagram DM automation bot",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable}`}>{children}</body>
    </html>
  )
}
