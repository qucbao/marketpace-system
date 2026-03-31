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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
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
                imageUrls
        );
    }
}
