import type React from "react"
import type { Metadata } from "next"
import { Familjen_Grotesk, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { SOPProvider } from "@/lib/sop-context"
import ConvexClientProvider from "@/components/ConvexClientProvider"
import "./globals.css"

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Stepease - AI-Powered Standard Operating Procedures",
  description:
    "Create, improve, and manage Standard Operating Procedures in minutes with AI. Transform your business processes into professional documentation.",
  icons: {
    icon: "/icon-bg.png",
    apple: "/icon-bg.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#2563eb',
          fontFamily: 'var(--font-sans)',
        },
      }}
    >
      <html lang="en" className={`${familjenGrotesk.variable} ${inter.variable}`}>
        <body className="font-sans antialiased" suppressHydrationWarning>
          <ConvexClientProvider>
            <SOPProvider>{children}</SOPProvider>
            <Analytics />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
