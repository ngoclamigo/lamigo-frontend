/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { AlertCircle, ArrowLeft, CheckCircle, FileText, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

const ALLOWED_FILE_TYPES = [
  "text/markdown",
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setSuccess(false);

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setError("Invalid file type. Only markdown, PDF, text, DOC, and DOCX files are allowed.");
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size too large. Maximum size is 10MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        setSuccess(true);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Redirect to documents page after a short delay
        setTimeout(() => {
          router.push("/admin/documents");
        }, 2000);
      } else {
        setError(result.error || "Failed to upload file");
      }
    } catch (err) {
      setError("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()} className="pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground">Add new documents to your library</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>
              Upload documents to your library. Supported formats: PDF, DOC, DOCX, TXT, MD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">File uploaded successfully! Redirecting...</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <p className="text-sm text-gray-500">
                Maximum file size: 10MB. Allowed formats: PDF, DOC, DOCX, TXT, MD
              </p>
            </div>

            {file && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-8 w-8 text-gray-400 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1">
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">File Requirements</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Maximum file size: 10MB</li>
                <li>• Supported formats: PDF, DOC, DOCX, TXT, MD</li>
                <li>• Files are automatically renamed to prevent conflicts</li>
                <li>• All uploaded files are stored securely</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
