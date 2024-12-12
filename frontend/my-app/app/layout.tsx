import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Supabase Compliance Demo',
  description: 'Get compliant today.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white text-black dark:bg-gray-900 dark:selection:bg-blue-900 dark:text-white h-full selection:bg-green-50">
          {children}
        </main>
      </body>
    </html>
  )
}

