"use client";

import { Eye, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";

interface Document {
  id: number;
  parent_document_id: number | null;
  path: string;
  checksum: string;
  meta: Record<string, unknown>;
  type: string;
  source: string;
}

type DialogType = "generate" | "delete" | "upload" | null;

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [generatingPath, setGeneratingPath] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/documents");
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const data = await response.json();
      setDocuments(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLearningPath = async () => {
    if (!selectedDocument) return;

    try {
      setGeneratingPath(true);
      setError(null);
      const response = await fetch(`/api/learning-paths`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentID: selectedDocument.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate learning path");
      }

      const data = await response.json();
      window.location.href = `/learning-paths/${data.data.learningPath.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate learning path");
    } finally {
      setGeneratingPath(false);
      setDialogType(null);
    }
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;

    try {
      setDeletingDocument(true);
      setError(null);
      const response = await fetch(`/api/documents/${selectedDocument.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      setSuccess(`Document "${selectedDocument.path}" deleted successfully`);
      // Remove the deleted document from the list
      setDocuments(documents.filter((doc) => doc.id !== selectedDocument.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document");
    } finally {
      setDeletingDocument(false);
      setDialogType(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if it's a markdown file
      if (!file.name.endsWith(".md") && !file.name.endsWith(".markdown")) {
        setError("Please upload a markdown file (.md or .markdown)");
        return;
      }

      setUploadFile(file);
      setError(null);
    }
  };

  const handleUploadDocument = async (e: FormEvent) => {
    e.preventDefault();

    if (!uploadFile) {
      setError("Please select a file first");
      return;
    }

    try {
      setUploadingDocument(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", uploadFile);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Document uploaded successfully!");
        setUploadFile(null);

        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Refresh the document list
        fetchDocuments();
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during upload");
    } finally {
      setUploadingDocument(false);
      setDialogType(null);
    }
  };

  const renderDialog = () => {
    if (!dialogType) return null;

    switch (dialogType) {
      case "generate":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-11/12 shadow-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-semibold">Generate Learning Path</h3>
              </div>
              <div className="px-5 py-4">
                <p>
                  Do you want to generate a learning path based on &quot;{selectedDocument?.path}
                  &quot;?
                </p>
                <p className="text-gray-600 mt-3 text-sm">
                  This will create a customized learning path based on the content of this document.
                </p>
              </div>
              <div className="flex justify-end px-5 py-4 border-t border-gray-200 gap-3">
                <button
                  className="px-4 py-2 rounded-lg border border-brand-500 text-brand-500 font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={() => setDialogType(null)}
                  disabled={generatingPath}
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-500 text-white font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleGenerateLearningPath}
                  disabled={generatingPath}
                >
                  {generatingPath ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">�</span>
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case "delete":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-11/12 shadow-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-semibold">Delete Document</h3>
              </div>
              <div className="px-5 py-4">
                <p>
                  Are you sure you want to delete &quot;{selectedDocument?.path}&quot;?
                </p>
                <p className="mt-3 text-sm text-red-600">
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end px-5 py-4 border-t border-gray-200 gap-3">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={() => setDialogType(null)}
                  disabled={deletingDocument}
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-red-500 text-white font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleDeleteDocument}
                  disabled={deletingDocument}
                >
                  {deletingDocument ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">�️</span>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case "upload":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-11/12 shadow-lg">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-semibold">Upload Document</h3>
              </div>
              <form onSubmit={handleUploadDocument}>
                <div className="px-5 py-4">
                  <p className="mb-4">Upload a markdown file to create a new document.</p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Select a markdown file (.md)</label>
                    <input
                      type="file"
                      accept=".md,.markdown"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      ref={fileInputRef}
                    />
                  </div>
                  {uploadFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p><span className="font-medium">Name:</span> {uploadFile.name}</p>
                      <p><span className="font-medium">Size:</span> {(uploadFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end px-5 py-4 border-t border-gray-200 gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={() => setDialogType(null)}
                    disabled={uploadingDocument}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-500 text-white font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={uploadingDocument || !uploadFile}
                  >
                    {uploadingDocument ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📤</span>
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Documents</h1>
        <button
          className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-500 text-white font-medium text-sm"
          onClick={() => setDialogType("upload")}
        >
          <span className="mr-2">📄</span>
          Upload Document
        </button>
      </div>

      {error && (
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-lg text-gray-600 mb-6">
            No documents found. Upload your first document to get started.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-500 text-white font-medium"
            onClick={() => setDialogType("upload")}
          >
            <span className="mr-2">📤</span>
            Upload Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <div
              className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white flex flex-col"
              key={document.id}
            >
              <div className="flex items-center mb-3">
                <span className="mr-2 text-xl">📄</span>
                <h2 className="text-xl font-semibold truncate">{document.path}</h2>
              </div>

              <p className="text-gray-600 mb-4 flex-grow">Type: {document.type}</p>

              <div className="text-sm text-gray-500 mb-4">
                Source: {document.source || "Unknown"}
              </div>

              <div className="flex justify-between space-x-2">
                {/* <a
                  href={`/documents/${document.id}`}
                  className="inline-flex items-center px-3 py-2 rounded-lg border border-brand-500 text-brand-500 font-medium text-sm"
                >
                  <Eye className="mr-1 size-4" /> View
                </a> */}
                <button
                  className="inline-flex items-center px-3 py-2 rounded-lg bg-brand-500 text-white font-medium text-sm"
                  onClick={() => {
                    setSelectedDocument(document);
                    setDialogType("generate");
                  }}
                >
                  <RefreshCw className="mr-1 size-4" /> Generate Path
                </button>
                <button
                  className="inline-flex items-center px-3 py-2 rounded-lg bg-red-500 text-white font-medium text-sm"
                  onClick={() => {
                    setSelectedDocument(document);
                    setDialogType("delete");
                  }}
                >
                  <Trash2 className="mr-1 size-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {renderDialog()}
    </div>
  );
}
