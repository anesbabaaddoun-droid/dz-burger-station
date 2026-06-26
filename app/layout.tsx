import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { ThemeProvider } from '@/lib/theme-context'
import { ThemeRoot } from '@/components/theme-root'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const bebas = Bebas_Neue({ variable: '--font-bebas', subsets: ['latin'], weight: '400' })
const mono = JetBrains_Mono({ variable: '--font-jbmono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crisp Quick — Flame-Fast Food',
  description: 'Order delicious burgers, pizza, sides and drinks with fast delivery',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#B91C1C' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} ${mono.variable}`}>
      <body className="font-sans antialiased bg-[#161210] text-[#F3EDE3]">
        <ThemeProvider>
          <ThemeRoot>
            <CartProvider>
              {children}
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </CartProvider>
          </ThemeRoot>
        </ThemeProvider>
      </body>
    </html>
  )
}
