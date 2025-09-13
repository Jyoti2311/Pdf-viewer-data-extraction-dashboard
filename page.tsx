"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import PDFViewer from "./components/PDFViewer";
import InvoiceForm from "./components/Invoiceform";
import InvoiceList from "./components/Invoicelist";
import api from "../utils/api";

interface InvoiceRecord {
  _id?: string;
  fileId: string;
  fileName: string;
  vendor: {
    name: string;
    address?: string;
    taxId?: string;
  };
  invoice: {
    number: string;
    date: string;
    currency?: string;
    subtotal?: number;
    taxPercent?: number;
    total?: number;
    poNumber?: string;
    poDate?: string;
    lineItems: {
      description: string;
      unitPrice: number;
      quantity: number;
      total: number;
    }[];
  };
  createdAt: string;
  updatedAt?: string;
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<Partial<InvoiceRecord>>({});
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setFileId(null);
    setInvoiceData({});
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF first!");

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await api.post("/upload", formData);
      setFileId(res.data.fileId);
      alert("Upload successful! You can now extract data.");
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    if (!fileId) return alert("Upload a PDF first!");

    setLoading(true);
    try {
      const res = await api.post("/extract", { fileId, model: "gemini" });
      setInvoiceData(res.data);
      alert("Extraction successful!");
    } catch (err) {
      console.error(err);
      alert("Extraction failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!fileId) return alert("Upload a PDF first!");

    setLoading(true);
    try {
      if (invoiceData._id) {
        await api.put(`/invoices/${invoiceData._id}`, invoiceData);
      } else {
        await api.post("/invoices", { ...invoiceData, fileId, fileName: file?.name || "" });
      }
      alert("Invoice saved!");
      fetchInvoices();
    } catch (err) {
      console.error(err);
      alert("Save failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!invoiceData._id) return alert("No invoice selected to delete");

    setLoading(true);
    try {
      await api.delete(`/invoices/${invoiceData._id}`);
      alert("Invoice deleted!");
      setInvoiceData({});
      fetchInvoices();
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (query = "") => {
    try {
      const res = await api.get("/invoices", { params: { q: query } });
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch invoices");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchInvoices(e.target.value);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📄 PDF Review & Extraction Dashboard
      </h1>

      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6 flex space-x-6">
        {/* Left panel: PDF Viewer */}
        <div className="w-1/2 border rounded p-4 flex flex-col">
          <PDFViewer file={file} onFileChange={handleFileChange} />
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Uploading...
              </span>
            ) : (
              "Upload PDF"
            )}
          </button>
        </div>

        {/* Right panel: Invoice form and list */}
        <div className="w-1/2 flex flex-col">
          <InvoiceForm
            fileId={fileId}
            data={invoiceData}
            onDataChange={setInvoiceData}
            onExtract={handleExtract}
            onSave={handleSave}
            onDelete={handleDelete}
          />
          <div className="mt-6">
            <input
              type="search"
              placeholder="Search invoices by vendor or number"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded mb-4"
            />
            <InvoiceList invoices={invoices} onSelect={setInvoiceData} />
          </div>
        </div>
      </div>
    </main>
  );
}
