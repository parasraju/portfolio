import type { Metadata } from "next";
import { Geist, Doto } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/components/ui/LoadingProvider";
import { Preloader } from "@/components/ui/Preloader";
import { PRELOADER_SEEN_KEY } from "@/lib/preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Paras Raju",
  description:
    "Full stack developer building clean, modern websites and apps with a focus on design, functionality, and attention to detail.",
};

const bootScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");if(sessionStorage.getItem(${JSON.stringify(PRELOADER_SEEN_KEY)})==="1")document.documentElement.classList.add("preloaded");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html
      lang="en"
      className={`${geistSans.variable} ${doto.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`#preloader{display:none}.reveal,.reveal-stagger>*,.grid-line-v,.grid-line-h,.grid-dot,.index-nav,.banner-img{opacity:1;transform:none}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <LoadingProvider>
          <Preloader />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
