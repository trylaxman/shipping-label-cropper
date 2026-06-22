import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "How to Separate Amazon Shipping Labels from Invoices",
    description:
        "Learn how to separate Amazon shipping labels from invoices and download shipping labels only using Baiko's free PDF cropper tool.",
    alternates: {
        canonical:
            "https://shipping-label-cropper.baikolife.com/how-to-separate-amazon-shipping-labels-from-invoices",
    },
};

export default function AmazonGuidePage() {
    return (
        <main className="min-h-screen bg-black px-5 py-12 text-white">
            <article className="mx-auto max-w-3xl">
                <div>
                    <Link href="/" className="text-sm font-semibold text-[#9AE600]">
                        ← Back to free tool
                    </Link>
                </div>

                <div className="mt-8 inline-flex rounded-full border border-[#9AE600]/30 bg-[#9AE600]/10 px-4 py-2 text-sm text-[#9AE600]">
                    Amazon Seller Guide
                </div>

                <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
                    How to Separate Amazon Shipping Labels from Invoices
                </h1>

                <p className="mt-5 text-lg leading-8 text-zinc-400">
                    Amazon sellers often download one PDF that contains both shipping
                    labels and invoices. Usually, odd pages contain shipping labels and
                    even pages contain invoices. Separating them manually can take time,
                    especially when processing multiple orders.
                </p>

                <section className="mt-10 rounded-3xl border border-zinc-800 bg-[#111111] p-6">
                    <h2 className="text-2xl font-bold text-white">
                        The easiest way to separate Amazon labels
                    </h2>

                    <ol className="mt-5 space-y-3 text-zinc-400">
                        <li>1. Open the free Baiko Shipping Label Cropper.</li>
                        <li>2. Select Amazon from the marketplace dropdown.</li>
                        <li>3. Upload your Amazon shipping label PDF.</li>
                        <li>4. Click Crop & Separate PDF.</li>
                        <li>5. Download shipping labels and invoices separately.</li>
                    </ol>
                </section>

                <div className="mt-10 rounded-3xl border border-zinc-800 bg-[#111111] p-6 shadow-2xl shadow-black/30">
                    <h2 className="text-xl font-bold text-white">
                        Try the free Amazon label cropper
                    </h2>

                    <p className="mt-3 leading-7 text-zinc-400">
                        Use Baiko’s free online tool to separate Amazon shipping labels from
                        invoices instantly. Your PDF is processed inside your browser.
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
                        Is my PDF uploaded to a server?
                    </h2>

                    <p className="mt-4 leading-8 text-zinc-400">
                        No. The tool processes your PDF directly in your browser. Your file
                        is not uploaded to Baiko servers.
                    </p>
                </section>
            </article>
        </main>
    );
}