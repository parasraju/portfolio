import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { IntroGate } from "@/components/intro/IntroGate";
import { EntranceTrigger } from "@/components/ui/EntranceTrigger";
import { INTRO_PENDING_CLASS, INTRO_SESSION_KEY } from "@/lib/intro";
import { Navbar } from "@/components/ui/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paras Raju",
  description:
    "Full stack developer building clean, modern websites and apps with a focus on design, functionality, and attention to detail.",
};

const bootScript = `(function(){try{var e=document.documentElement;var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)e.classList.add("dark");var s=null;try{s=sessionStorage.getItem("${INTRO_SESSION_KEY}")}catch(x){}if(!s||/[?&]intro(?:[=&]|$)/.test(location.search)){e.classList.add("${INTRO_PENDING_CLASS}");var b=d?"#0e0c0c":"#f3eee3";try{var p=JSON.parse(localStorage.getItem("terminal-theme")||"null");if(p&&p.bg&&p.mode===(d?"dark":"light"))b=p.bg}catch(x){}e.style.setProperty("--intro-bg",b)}}catch(x){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.reveal,.reveal-stagger>*,.grid-line-v,.grid-line-h,.grid-dot,.index-nav,.banner-img{opacity:1;transform:none}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <IntroGate />
        <EntranceTrigger />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
