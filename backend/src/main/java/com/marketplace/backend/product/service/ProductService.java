package com.marketplace.backend.product.service;

import com.marketplace.backend.category.entity.Category;
import com.marketplace.backend.category.repository.CategoryRepository;
import com.marketplace.backend.product.dto.ProductCreateRequest;
import com.marketplace.backend.product.dto.ProductResponse;
import com.marketplace.backend.product.dto.ProductUpdateRequest;
import com.marketplace.backend.product.entity.Product;
import com.marketplace.backend.product.entity.ProductImage;
import com.marketplace.backend.product.entity.ProductStatus;
import com.marketplace.backend.product.repository.ProductRepository;
import com.marketplace.backend.shop.entity.Shop;
import com.marketplace.backend.shop.entity.ShopStatus;
import com.marketplace.backend.shop.repository.ShopRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, ShopRepository shopRepository,
                          CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.shopRepository = shopRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String query, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String sort) {
        Specification<Product> spec = (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only show active products
            predicates.add(cb.equal(root.get("status"), ProductStatus.ACTIVE));

            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sort != null) {
            switch (sort) {
                case "price_asc":
                    sortOrder = Sort.by(Sort.Direction.ASC, "price");
                    break;
                case "price_desc":
                    sortOrder = Sort.by(Sort.Direction.DESC, "price");
                    break;
                case "hot":
                    sortOrder = Sort.by(Sort.Direction.DESC, "soldCount");
                    break;
                case "newest":
                default:
                    sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
                    break;
            }
        }

        return productRepository.findAll(spec, sortOrder)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        return convertToResponse(getProductEntity(id));
    }

    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        Shop shop = getShopEntity(request.getShopId());
        validateShopOwner(shop, request.getOwnerId());
        validateApprovedShop(shop);

        Category category = getCategoryEntity(request.getCategoryId());
        Instant now = Instant.now();

        Product product = new Product();
        product.setName(request.getName().trim());
        product.setDescription(request.getDescription().trim());
        product.setCondition(request.getCondition().trim());
        product.setPrice(request.getPrice());
        product.setShop(shop);
        product.setCategory(category);
        product.setStatus(ProductStatus.ACTIVE);
        product.setStock(request.getStock());
        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        if (request.getImageUrls() != null) {
            List<ProductImage> images = request.getImageUrls().stream()
                    .map(url -> {
                        ProductImage image = new ProductImage();
                        image.setImageUrl(url);
                        image.setProduct(product);
                        return image;
                    })
                    .collect(Collectors.toList());
            product.setImages(images);
        }

        return convertToResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = getProductEntity(id);
        validateShopOwner(product.getShop(), request.getOwnerId());

        Category category = getCategoryEntity(request.getCategoryId());

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription().trim());
        product.setCondition(request.getCondition().trim());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setStatus(request.getStatus());
        product.setStock(request.getStock());
        product.setUpdatedAt(Instant.now());

        if (request.getImageUrls() != null) {
            product.getImages().clear();
            List<ProductImage> newImages = request.getImageUrls().stream()
                    .map(url -> {
                        ProductImage image = new ProductImage();
                        image.setImageUrl(url);
                        image.setProduct(product);
                        return image;
                    })
                    .collect(Collectors.toList());
            product.getImages().addAll(newImages);
        }

        return convertToResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id, Long ownerId) {
        Product product = getProductEntity(id);
        validateShopOwner(product.getShop(), ownerId);
        productRepository.delete(product);
    }

    private Product getProductEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    private Shop getShopEntity(Long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shop not found"));
    }

    private Category getCategoryEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    private void validateShopOwner(Shop shop, Long ownerId) {
        if (!shop.getOwner().getId().equals(ownerId)) {
            throw new IllegalArgumentException("You are not the owner of this shop");
        }
    }

    private void validateApprovedShop(Shop shop) {
        if (shop.getStatus() != ShopStatus.APPROVED) {
            throw new IllegalArgumentException("Your shop is not approved yet");
        }
    }

    private ProductResponse convertToResponse(Product product) {
        List<String> imageUrls = product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getCondition(),
                product.getPrice(),
                product.getStock(),
                product.getStatus(),
                product.getShop().getId(),
                product.getShop().getName(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getShop().getOwner().getId(),
                product.getShop().getOwner().getFullName(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                imageUrls,
                product.getAverageRating(),
                product.getSoldCount()
        );
    }
}
