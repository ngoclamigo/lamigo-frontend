export async function getDocuments() {
  const response = await fetch("/api/documents", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }
  const data = await response.json();
  return data.data || [];
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/documents/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  const data = await response.json();
  return data.data;
}

export async function deleteDocument(bucketPath: string) {
  const response = await fetch(`/api/documents/${bucketPath}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete document");
  }

  const data = await response.json();
  return data;
}

export async function downloadDocument(bucketPath: string) {
  const response = await fetch(`/api/documents/${bucketPath}/download`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to download document");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = bucketPath; // You can customize the filename here
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
