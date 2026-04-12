import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'FedSignal — Government Funding Intelligence for Universities',
  description: 'The federal contracting intelligence platform built for HBCUs and research universities. Win more contracts. Track every prime relationship. Outposition peer institutions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="theme-tuskegee">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
