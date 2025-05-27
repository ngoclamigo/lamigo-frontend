import type { Metadata } from 'next'
import { Jost } from 'next/font/google'

import { Provider } from '~/components/ui/provider'
import { Toaster } from '~/components/ui/toaster'

const jost = Jost({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lamigo AI',
  description: 'Your personal champion who never sleeps',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.variable}`}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  )
}
