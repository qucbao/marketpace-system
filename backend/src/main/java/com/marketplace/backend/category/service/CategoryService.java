package com.marketplace.backend.category.service;

import com.marketplace.backend.category.dto.CategoryResponse;
import com.marketplace.backend.category.repository.CategoryRepository;
import com.marketplace.backend.category.entity.Category;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName()))
                .toList();
    }

    @Transactional
    public CategoryResponse createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        Category saved = categoryRepository.save(category);
        return new CategoryResponse(saved.getId(), saved.getName());
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, String name) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));
        category.setName(name);
        Category saved = categoryRepository.save(category);
        return new CategoryResponse(saved.getId(), saved.getName());
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy danh mục để xóa");
        }
        categoryRepository.deleteById(id);
    }
}
