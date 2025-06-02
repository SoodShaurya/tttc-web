import { GeistSans } from 'geist/font/sans'
import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import ThemeToggle from '@/components/ThemeToggle'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'TTTC Final Project',
  description: 'The Things They Carried',
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
                    <div className="header-row grid md:grid-cols-5">
                      {/* Left Group: Spans 3 columns - border removed, logo and cross-dot spacer added */}
                      <div className="md:col-span-3 flex"> {/* Removed border-r-2 border-[#6e7b99] */}
                        <div className="header-box logo-box"> {/* Fixed width defined in globals.css */}
                            <img src="/fixedlogo.png" alt="Logo" className="logo-image" />
                        </div>
                        {/* Box with dot cross pattern, takes remaining width */}
                        <div className="header-box spacer-box cross-dots h-24"> {/* Re-using spacer-box for flex-grow, ensuring height, added cross-dots */}
                          {/* Content for this box can be added if needed, or it's just a pattern */}
                        </div>
                      </div>
                      {/* Right Group: Spans 2 columns - populated with dashed-box */}
                      <div className="md:col-span-2 flex">
                        <div className="dashed-box h-24 flex-1">
                          {/* Content for dashed box if needed */}
                        </div>
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
