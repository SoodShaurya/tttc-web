import { GeistSans } from 'geist/font/sans'
import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactQueryProvider from '@/providers/ReactQueryProvider'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={GeistSans.className}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            {/* Outer bordered layout */}
            <div className="bg"></div>

            <div className="bordered-layout">
              {/* Scrollable inner container */}
              <div className="scroll-container">
                <header className="sticky-header">
                    <div className="header-row">
                      <div className="header-box logo-box">
                          <img src="/fixedlogo.png" alt="Logo" className="logo-image" />
                            </div>
                                <div className="header-box spacer-box dashed-box">
                                </div>
                            <div className="header-box works-box cross-dots">
                          <span> </span>
                          <span> </span>
                      </div>
                      <div className="header-box account-box">
                          <div className="menu-line"></div>
                          <div className="menu-line"></div>
                          <div className="menu-line"></div>
                      </div>
                      <div className="header-box menu-box">
                          <div className="menu-line"></div>
                          <div className="menu-line"></div>
                          <div className="menu-line"></div>
                      </div>
                    </div>
                  </header>
                <main className="content">{children}</main>
              </div>
            </div>
            <Analytics />

          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
