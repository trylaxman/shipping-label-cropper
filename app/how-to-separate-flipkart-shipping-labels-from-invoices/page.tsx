import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "How to Separate Flipkart Shipping Labels from Invoices",
    description:
        "Learn how to separate Flipkart and Ekart shipping labels from invoices using Baiko's free online PDF cropper tool.",
    alternates: {
        canonical:
            "https://shipping-label-cropper.baikolife.com/how-to-separate-flipkart-shipping-labels-from-invoices",
    },
};

export default function FlipkartGuidePage() {
    return (
        <main className="min-h-screen bg-black px-5 py-12 text-white">
            <article className="mx-auto max-w-3xl">
                <div>
                    <Link href="/" className="text-sm font-semibold text-[#9AE600]">
                        ← Back to free tool
                    </Link>
                </div>

                <div className="mt-8 inline-flex rounded-full border border-[#9AE600]/30 bg-[#9AE600]/10 px-4 py-2 text-sm text-[#9AE600]">
                    Flipkart & Ekart Seller Guide
                </div>

                <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
                    How to Separate Flipkart Shipping Labels from Invoices
                </h1>

                <p className="mt-5 text-lg leading-8 text-zinc-400">
                    Flipkart seller PDFs usually contain the shipping label and tax
                    invoice on the same page. The shipping label appears at the top,
                    while the invoice appears below the separator line. This makes
                    manual cropping slow when processing multiple orders.
                </p>

                <section className="mt-10 rounded-3xl border border-zinc-800 bg-[#111111] p-6">
                    <h2 className="text-2xl font-bold text-white">
                        The easiest way to crop Flipkart labels
                    </h2>

                    <ol className="mt-5 space-y-3 text-zinc-400">
                        <li>1. Open the free Baiko Shipping Label Cropper.</li>
                        <li>2. Select Flipkart from the marketplace dropdown.</li>
                        <li>3. Upload your Flipkart or Ekart shipping PDF.</li>
                        <li>4. Click Crop & Separate PDF.</li>
                        <li>5. Download shipping labels and invoices separately.</li>
                    </ol>
                </section>

                <div className="mt-10 rounded-3xl border border-zinc-800 bg-[#111111] p-6 shadow-2xl shadow-black/30">
                    <h2 className="text-xl font-bold text-white">
                        Try the free Flipkart label cropper
                    </h2>

                    <p className="mt-3 leading-7 text-zinc-400">
                        Baiko’s free tool detects the Flipkart separator line and
                        automatically separates shipping labels and invoices into two
                        PDF files.
                    </p>

                    <Link
                        href="/"
                        className="mt-5 inline-block rounded-2xl bg-[#9AE600] px-6 py-3 font-semibold text-black transition hover:opacity-90"
                    >
                        Open Free Tool
                    </Link>
                </div>

                <section className="mt-10 rounded-3xl border border-zinc-800 bg-[#111111] p-6">
                    <h2 className="text-2xl font-bold text-white">
                        Does this work for Ekart labels?
                    </h2>

                    <p className="mt-4 leading-8 text-zinc-400">
                        Yes. Flipkart shipping labels often use Ekart Logistics.
                        The tool is designed to work with Flipkart and Ekart seller
                        label PDFs and automatically detects the separator line
                        between shipping labels and invoices.
                    </p>
                </section>

                <section className="mt-10 rounded-3xl border border-zinc-800 bg-[#111111] p-6">
                    <h2 className="text-2xl font-bold text-white">
                        Are my files uploaded?
                    </h2>

                    <p className="mt-4 leading-8 text-zinc-400">
                        No. Your PDF is processed directly inside your browser.
                        Files are never uploaded to Baiko servers.
                    </p>
                </section>
            </article>
        </main>
    );
}