import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PostHogProvider from "@/components/PostHogProvider";
import Link from "next/link";

const siteUrl = "https://shipping-label-cropper.baikolife.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Free Amazon & Flipkart Shipping Label Cropper | Separate Labels & Invoices",
    template: "%s | Baiko Shipping Label Cropper",
  },
  description:
    "Separate Amazon and Flipkart shipping labels from invoices instantly. Upload your PDF and download shipping labels and invoices separately. Free online tool by Baiko.",
  keywords: [
    "amazon shipping label cropper",
    "flipkart shipping label cropper",
    "amazon invoice separator",
    "flipkart invoice separator",
    "shipping label splitter",
    "amazon label invoice split pdf",
    "remove invoice from amazon shipping label",
    "ekart shipping label cropper",
  ],
  authors: [{ name: "Baiko" }],
  creator: "Baiko",
  publisher: "Baiko",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title:
      "Free Amazon & Flipkart Shipping Label Cropper | Separate Labels & Invoices",
    description:
      "Upload Amazon or Flipkart PDFs and instantly separate shipping labels and invoices.",
    url: siteUrl,
    siteName: "Baiko Shipping Label Cropper",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Free Amazon and Flipkart Shipping Label Cropper by Baiko",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Amazon & Flipkart Shipping Label Cropper",
    description:
      "Separate shipping labels and invoices from Amazon and Flipkart PDFs instantly.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Baiko Shipping Label Cropper",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description:
      "Free online tool to separate Amazon and Flipkart shipping labels from invoices.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    publisher: {
      "@type": "Organization",
      name: "Baiko",
      url: "https://baikolife.com",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}

        <Analytics />
        <SpeedInsights />
        <PostHogProvider />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareSchema),
          }}
        />
      </body>
      <footer className="mx-auto mt-16 max-w-4xl border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        <p>
          Built by{" "}
          <a
            href="https://baikolife.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#9AE600]"
          >
            Baiko
          </a>
          .
        </p>

        <p className="mt-2">
          Free tools for Amazon, Flipkart and marketplace sellers.
        </p>

        <p className="mt-4">© 2026 Baiko. All rights reserved.</p>

        <Link href="/" className="mt-2 inline-block font-semibold text-[#9AE600]">
          Shipping Label Cropper
        </Link>
      </footer>
    </html>
  );
}