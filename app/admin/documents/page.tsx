"use client";

import { AlertCircle, Download, FileText, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatBytes, formatDate } from "~/lib/utils";
import { Document } from "~/types/document";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/documents");
      const result = await response.json();

      if (result.status === "success") {
        setDocuments(result.data);
      } else {
        setError(result.error || "Failed to fetch documents");
      }
    } catch (err) {
      setError("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${path}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.status === "success") {
        setDocuments(documents.filter((doc) => doc.bucket_path !== path));
      } else {
        alert(result.error || "Failed to delete document");
      }
    } catch (err) {
      alert("Failed to delete document");
    }
  };

  const handleDownload = async (path: string) => {
    try {
      const response = await fetch(`/api/documents/${path}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = path;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download document");
      }
    } catch (err) {
      alert("Failed to download document");
    }
  };

  const getFileTypeColor = (type: string) => {
    if (type.includes("pdf")) return "destructive";
    if (type.includes("word") || type.includes("document")) return "secondary";
    if (type.includes("text") || type.includes("markdown")) return "default";
    return "outline";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Documents</h1>
        </div>
        <div className="text-center py-8">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Documents</h1>
        </div>
        <Card>
          <CardContent className="flex items-center gap-2 p-6">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive">{error}</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Button asChild>
          <Link href="/documents/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            Manage your uploaded documents. Total: {documents.length} files
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents found</h3>
              <p className="text-gray-500 mb-4">Upload your first document to get started.</p>
              <Button asChild>
                <Link href="/documents/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {document.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getFileTypeColor(document.type)}>
                        {document.type.split("/")[1] || document.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatBytes(document.size)}</TableCell>
                    <TableCell>{formatDate(document.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(document.bucket_path)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(document.bucket_path)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
