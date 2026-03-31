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
  
  getDownloadUrl: (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080/api';
    
    // Nếu path đã bao gồm /api/files/download/, ta chỉ cần ghép với Origin
    if (path.startsWith('/api/files/download/')) {
      const origin = baseUrl.replace(/\/api$/, '');
      return `${origin}${path}`;
    }
    
    // Nếu path chỉ là tên file (vd: image.jpg)
    if (!path.startsWith('/') && !path.includes('/')) {
      return `${baseUrl}/files/download/${path}`;
    }

    // Fallback: nếu path bắt đầu bằng /api nhưng không thuộc download
    if (path.startsWith('/api')) {
      const origin = baseUrl.replace(/\/api$/, '');
      return `${origin}${path}`;
    }
    
    // Ngược lại ghép bình thường
    return `${baseUrl}/files/download/${path}`;
  }
};
