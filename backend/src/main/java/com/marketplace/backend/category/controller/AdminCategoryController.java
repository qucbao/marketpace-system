package com.marketplace.backend.category.controller;

import com.marketplace.backend.category.dto.CategoryResponse;
import com.marketplace.backend.category.service.CategoryService;
import com.marketplace.backend.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryService categoryService;

    public AdminCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> create(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên danh mục không được để trống");
        }
        CategoryResponse response = categoryService.createCategory(name);
        return ResponseEntity.ok(ApiResponse.ok("Tạo danh mục thành công", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> update(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên danh mục không được để trống");
        }
        CategoryResponse response = categoryService.updateCategory(id, name);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật danh mục thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa danh mục thành công", null));
    }
}
