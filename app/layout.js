import { Newsreader, Manrope } from 'next/font/google'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic']
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap'
})

export const metadata = {
  title: 'Chronos - Editorial Wall Calendar',
  description: 'The Tactile Chronos - A physical-first editorial planning experience.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  )
}
