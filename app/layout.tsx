// app/layout.tsx
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import Head from "next/head";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <Head>
                <link rel="manifest" href="/static/manifest.json" />
            </Head>
            <body className="p-5">
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
