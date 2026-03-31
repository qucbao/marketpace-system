import { apiClient } from "@/lib/api/client";

export const filesApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<string>("/files/upload", formData);
  },

  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    return apiClient.post<string[]>("/files/upload-multiple", formData);
  },
  
  getDownloadUrl: (filename: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/files/download/${filename}`;
  }
};
