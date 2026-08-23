import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  themeColor: '#07090e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://chrisland-gst206-showcase.vercel.app'),
  title: 'AI Literacy & Vibe Coding Showcase | S. B. Omotoso · Chrisland University',
  description: 'Chrisland University GST 206 Showcase by S. B. Omotoso. Educating the university community through AI Literacy, Vibe Coding, and Vibe Engineering to address campus Stress, Anxiety, and Depression. Featuring 29 student-created web apps, 3 collaborative syndicate platforms, and 29 music videos.',
  applicationName: 'Chrisland GST 206 AI & Vibe Coding Showcase',
  authors: [{ name: 'S. B. Omotoso', url: 'https://linkedin.com' }],
  generator: 'Next.js',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GST 206 AI Showcase',
  },
  keywords: [
    'S. B. Omotoso',
    'AI Literacy',
    'Vibe Coding',
    'Vibe Engineering',
    'Web App Development',
    'Web Development',
    'Stress Management',
    'Anxiety Support',
    'Depression Intervention',
    'Mental Health in Higher Education',
    'Chrisland University Abeokuta',
    'GST 206',
    'Artificial Intelligence Education',
    'Student Web Applications',
    'Full Stack Applications',
    'Next.js',
    'Generative AI Pedagogy',
    'Academic Portfolio Showcase'
  ],
  creator: 'S. B. Omotoso · Chrisland University, Abeokuta',
  publisher: 'Chrisland University',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'AI Literacy & Vibe Coding Showcase | Chrisland University',
    description: 'Explore 29 individual web applications, 3 collaborative group platforms, and 29 video presentations developed by students mastering AI Literacy, Vibe Coding, Vibe Engineering, and Web App Development.',
    url: 'https://chrisland-gst206-showcase.vercel.app',
    siteName: 'Chrisland University GST 206 AI Literacy Showcase',
    images: [
      { 
        url: '/Chrisland-Logo.jpeg', 
        width: 512, 
        height: 512, 
        alt: 'Chrisland University Official Crest' 
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Literacy, Vibe Coding & Web App Development | Chrisland University',
    description: 'Explore student innovations in AI Literacy, Vibe Coding, Vibe Engineering, and Web Development at Chrisland University GST 206.',
    images: ['/Chrisland-Logo.jpeg'],
    creator: '@ChrislandUni',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#07090e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="antialiased bg-[#07090e] text-slate-100 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
