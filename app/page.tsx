"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  cropFlipkartPdf,
  downloadPdf,
  Marketplace,
  splitAmazonPdf,
  validatePdfSelection,
} from "@/lib/pdfTools";
import { trackEvent } from "@/lib/analytics";

export default function HomePage() {
  const [marketplace, setMarketplace] = useState<Marketplace>("amazon");
  const [file, setFile] = useState<File | null>(null);
  const [shippingBytes, setShippingBytes] = useState<Uint8Array | null>(null);
  const [invoiceBytes, setInvoiceBytes] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleProcess() {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setShippingBytes(null);
    setInvoiceBytes(null);

    try {
      await validatePdfSelection(file, marketplace);

      const result =
        marketplace === "amazon"
          ? await splitAmazonPdf(file)
          : await cropFlipkartPdf(file);

      setShippingBytes(result.shippingBytes);
      setInvoiceBytes(result.invoiceBytes);
      setSuccess("PDF processed successfully.");

      trackEvent("pdf_processed", {
        marketplace,
        status: "success",
      });
    } catch (err: any) {
      const errorMessage =
        err.message || "Something went wrong while processing PDF.";

      setError(errorMessage);

      trackEvent("pdf_processed", {
        marketplace,
        status: "failed",
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    setError("");
    setSuccess("");
    setShippingBytes(null);
    setInvoiceBytes(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setFile(selectedFile);

    trackEvent("pdf_uploaded", {
      marketplace,
      file_name: selectedFile.name,
      file_size: selectedFile.size,
    });
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this Amazon shipping label cropper free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The tool is completely free to use.",
        },
      },
      {
        "@type": "Question",
        name: "Are my PDFs uploaded to a server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. PDF processing happens directly in your browser.",
        },
      },
      {
        "@type": "Question",
        name: "Can I separate Amazon invoices from shipping labels?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Upload your Amazon PDF and download shipping labels and invoices separately.",
        },
      },
      {
        "@type": "Question",
        name: "Can I separate Flipkart invoices from shipping labels?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The tool automatically separates Flipkart shipping labels and invoices.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-5 py-10 text-white">
      <section className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 inline-flex items-center rounded-full border border-[#9AE600]/30 bg-[#9AE600]/10 text-[#9AE600] px-4 py-2 text-sm">
            <FileText size={16} className="mr-2" />
            Free Shipping Label Cropper by Baiko
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-4xl">
            Free Amazon & Flipkart Shipping Label Cropper
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Upload your PDF and instantly separate shipping labels
            and invoices.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#111111] p-6 shadow-2xl shadow-black/30">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="rounded-2xl border border-zinc-800 bg-[#161616] p-5">
              <span className="mb-3 block text-sm font-semibold text-zinc-200">
                Select Marketplace
              </span>

              <select
                value={marketplace}
                onChange={(e) => {
                  const value = e.target.value as Marketplace;

                  setMarketplace(value);

                  trackEvent("marketplace_selected", {
                    marketplace: value,
                  });
                }}
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#9AE600]"
              >
                <option value="amazon">Amazon</option>
                <option value="flipkart">Flipkart</option>
              </select>
            </label>

            <label className="rounded-2xl border border-dashed border-zinc-700 bg-[#161616] p-5">
              <span className="mb-3 block text-sm font-semibold text-zinc-200">
                Upload PDF
              </span>

              <div className="flex items-center gap-3 text-zinc-300">

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[#9AE600] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:opacity-90"
                />
              </div>

              {file && (
                <p className="mt-3 truncate text-sm text-zinc-400">
                  Selected: {file.name}
                </p>
              )}
            </label>
          </div>

          <button
            onClick={handleProcess}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[#9AE600] px-5 py-4 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing PDF..." : "Crop & Separate PDF"}
          </button>

          <p className="mt-3 text-center text-sm text-zinc-400">
            🔒 Files never leave your browser. No uploads. No registration
            required.
          </p>

          {error && (
            <div className="mt-5 flex gap-3 rounded-2xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-5 flex gap-3 rounded-2xl border border-[#9AE600]/30 bg-[#9AE600]/10 p-4 text-sm text-[#9AE600]">
              <CheckCircle2 size={20} />
              <p>{success}</p>
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              disabled={!shippingBytes}
              onClick={() => {
                if (!shippingBytes) return;

                trackEvent("shipping_labels_downloaded", {
                  marketplace,
                });

                downloadPdf(
                  shippingBytes,
                  `${marketplace}-shipping-labels.pdf`
                );
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 px-5 py-4 font-semibold text-zinc-300 transition hover:border-[#9AE600]/50 hover:bg-zinc-900 hover:text-[#9AE600] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Download size={20} />
              Download Shipping Labels
            </button>

            <button
              disabled={!invoiceBytes}
              onClick={() => {
                if (!invoiceBytes) return;

                trackEvent("invoices_downloaded", {
                  marketplace,
                });

                downloadPdf(invoiceBytes, `${marketplace}-invoices.pdf`);
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 px-5 py-4 font-semibold text-zinc-300 transition hover:border-[#9AE600]/50 hover:bg-zinc-900 hover:text-[#9AE600] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Download size={20} />
              Download Invoices
            </button>
          </div>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <InfoCard
            title="Amazon PDFs"
            text="Odd pages are treated as shipping labels. Even pages are treated as invoices."
          />

          <InfoCard
            title="Flipkart PDFs"
            text="The tool detects Flipkart's dotted separator line and crops shipping labels and invoices separately."
          />

          <InfoCard
            title="Private & Free"
            text="PDF processing runs inside your browser. Files are not uploaded to any server."
          />
        </section>

        <section className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-white">
            How to Separate Amazon Shipping Labels from Invoices
          </h2>

          <p className="mt-4 leading-7 text-zinc-400">
            Amazon shipping label PDFs often contain shipping labels and
            invoices in a single document. This free Amazon shipping label
            cropper automatically separates shipping labels and invoices into
            two downloadable PDF files, making bulk order processing easier for
            Amazon sellers.
          </p>

          <ol className="mt-6 space-y-3 text-zinc-400">
            <li>1. Select Amazon.</li>
            <li>2. Upload your shipping label PDF.</li>
            <li>3. Click Crop & Separate PDF.</li>
            <li>4. Download shipping labels and invoices separately.</li>
          </ol>
        </section>

        <section className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-white">
            How to Separate Flipkart Shipping Labels from Invoices
          </h2>

          <p className="mt-4 leading-7 text-zinc-400">
            Flipkart shipping label PDFs usually contain both the shipping label
            and tax invoice on the same page. Our tool detects the separator
            line and automatically extracts shipping labels and invoices into
            separate PDF files.
          </p>

          <ol className="mt-6 space-y-3 text-zinc-400">
            <li>1. Select Flipkart.</li>
            <li>2. Upload your PDF.</li>
            <li>3. Click Crop & Separate PDF.</li>
            <li>4. Download shipping labels and invoices separately.</li>
          </ol>
        </section>

        <section className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-white">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-5">
            <FaqItem
              question="Is this Amazon shipping label cropper free?"
              answer="Yes. The tool is completely free to use."
            />

            <FaqItem
              question="Are my PDFs uploaded to a server?"
              answer="No. PDF processing happens directly in your browser and files are not uploaded to our servers."
            />

            <FaqItem
              question="Can I separate Amazon invoices from shipping labels?"
              answer="Yes. Upload your Amazon shipping PDF and the tool will generate separate shipping label and invoice PDFs."
            />

            <FaqItem
              question="Can I separate Flipkart invoices from shipping labels?"
              answer="Yes. The tool automatically detects Flipkart layouts and separates shipping labels and invoices into different PDFs."
            />
          </div>
        </section>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-3xl border border-zinc-800 bg-[#111111] p-6">
        <h2 className="text-2xl font-bold text-white">Helpful Guides</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Link
            href="/how-to-separate-amazon-shipping-labels-from-invoices"
            className="rounded-2xl border border-zinc-800 bg-[#161616] p-4 font-semibold text-[#9AE600] transition hover:border-[#9AE600]/50 hover:bg-zinc-900"
          >
            How to Separate Amazon Shipping Labels from Invoices →
          </Link>

          <Link
            href="/how-to-separate-flipkart-shipping-labels-from-invoices"
            className="rounded-2xl border border-zinc-800 bg-[#161616] p-4 font-semibold text-[#9AE600] transition hover:border-[#9AE600]/50 hover:bg-zinc-900"
          >
            How to Separate Flipkart Shipping Labels from Invoices →
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-5">
      <h3 className="font-semibold text-white">{question}</h3>
      <p className="mt-2 leading-6 text-zinc-400">{answer}</p>
    </div>
  );
}