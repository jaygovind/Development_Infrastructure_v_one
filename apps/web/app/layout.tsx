import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Next ↔ Nest Auth+Upload',
  description: 'JWT auth + MinIO upload demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee' }}>
          <Link href="/">Home</Link>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
          <Link href="/upload">Upload</Link>
        </nav>
        <div style={{ padding: 16 }}>{children}</div>
      </body>
    </html>
  );
}
