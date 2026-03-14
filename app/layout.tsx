import './globals.css'

export const metadata = {
  title: 'Echoes - Turn memories into music',
  description: 'Transform your personal moments into cinematic songs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
