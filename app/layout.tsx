import type React from "react"
import type { Metadata } from "next"
import { Familjen_Grotesk, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { SOPProvider } from "@/lib/sop-context"
import { SidebarProvider } from "@/components/layout/sidebar-context"
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
  manifest: "/manifest.json",
  openGraph: {
    title: "Stepease - AI-Powered Standard Operating Procedures",
    description: "Create, improve, and manage Standard Operating Procedures in minutes with AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stepease - AI-Powered Standard Operating Procedures",
    description: "Create, improve, and manage Standard Operating Procedures in minutes with AI.",
  },
}

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "StepEase",
  "description": "AI-powered Standard Operating Procedure builder that helps businesses create professional SOPs through natural conversation.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "featureList": [
    "Conversational SOP creation",
    "AI-powered improvements",
    "Multi-format export",
    "Real-time collaboration",
  ],
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
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="font-sans antialiased" suppressHydrationWarning>
          <ConvexClientProvider>
            <SOPProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </SOPProvider>
            <Analytics />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
