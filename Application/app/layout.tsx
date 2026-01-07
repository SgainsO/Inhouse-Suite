import type { Metadata } from "next";
import '@mantine/core/styles.css';
import { Geist, Geist_Mono } from "next/font/google";
import NavbarSimple from './components/Navbar/Navbar';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps, createTheme, MantineColorsTuple } from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#ecefff',
  '#d5dafb',
  '#a9b1f1',
  '#7a87e9',
  '#5362e1',
  '#3a4bdd',
  '#2c40dc',
  '#1f32c4',
  '#182cb0',
  '#0a259c'
];

const theme = createTheme({
  colors: {
    brand: myColor,
  },
  primaryColor: 'brand',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DGG CRM",
  description: "Volunteer Console CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
          <head>
            <ColorSchemeScript />
          </head>

          <body>
            <MantineProvider theme={theme}>
            <div style={{ display: 'flex' }}>
              <NavbarSimple />
              <main style={{ flex: 1, padding: '20px' }}>
                {children}
              </main>
            </div>
        </MantineProvider>
      </body>

    </html>
  );
}