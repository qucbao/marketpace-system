package com.marketplace.backend.file.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.file.service.FileStorageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/files")
public class FileUploadController {

    private final FileStorageService fileStorageService;
    private final Path rootLocation = Paths.get("uploads");

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.store(file);
        String fileUrl = "/api/files/download/" + filename;
        return ResponseEntity.ok(ApiResponse.ok("File uploaded successfully", fileUrl));
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<ApiResponse<List<String>>> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String filename = fileStorageService.store(file);
            fileUrls.add("/api/files/download/" + filename);
        }
        return ResponseEntity.ok(ApiResponse.ok("Files uploaded successfully", fileUrls));
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) throws IOException {
        Path file = rootLocation.resolve(filename);
        if (!Files.exists(file)) {
            return ResponseEntity.notFound().build();
        }
        Resource resource = new FileSystemResource(file);

        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
