import { Almarai } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import PropTypes from "prop-types";
import { LoadingSplash } from "@/components/Loading";

// Lazy-load Providers so layout.js stays small (avoids ChunkLoadError timeouts during dev recompiles)
const Providers = dynamic(() => import("./providers"), {
    loading: () => <LoadingSplash message="Loading application..." />,
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "أنماط | Anmat - نظام إدارة المؤسسات",
        template: "%s | أنماط Anmat",
    },
    description: "منصة متكاملة لإدارة المؤسسات والفرق — مشاريع، مهام، اجتماعات، تحليلات، وتواصل فوري. All-in-one management dashboard for teams and enterprises.",
    keywords: ["أنماط", "Anmat", "نظام إدارة", "management dashboard", "ERP", "team collaboration", "project management", "إدارة المشاريع", "إدارة الفرق"],
    authors: [{ name: "Anmat" }],
    creator: "Anmat",
    publisher: "Anmat",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: "website",
        locale: "ar_SA",
        alternateLocale: "en_US",
        siteName: "أنماط | Anmat",
        title: "أنماط | Anmat - نظام إدارة المؤسسات",
        description: "منصة متكاملة لإدارة المؤسسات والفرق — مشاريع، مهام، اجتماعات، تحليلات، وتواصل فوري.",
        url: siteUrl,
        images: [{ url: "/images/logoBlue.png", width: 512, height: 512, alt: "Anmat Logo" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "أنماط | Anmat - نظام إدارة المؤسسات",
        description: "منصة متكاملة لإدارة المؤسسات والفرق — مشاريع، مهام، اجتماعات، تحليلات، وتواصل فوري.",
        images: ["/images/logoBlue.png"],
    },
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico", sizes: "any" },
        ],
        apple: [{ url: "/images/logoBlue.png" }],
    },
    manifest: "/manifest.json",
    alternates: {
        languages: {
            ar: "/ar",
            en: "/en",
        },
    },
    other: {
        "application-name": "أنماط Anmat",
        "apple-mobile-web-app-title": "أنماط Anmat",
        "apple-mobile-web-app-capable": "yes",
    },
};

const almarai = Almarai({ subsets: ["arabic"], weight: ["300", "400", "700", "800"], display: "swap" });

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={almarai.className} suppressHydrationWarning>
                <Providers> {children}</Providers>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.node.isRequired,
}