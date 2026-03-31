package com.marketplace.backend.user.dto;

public record DashboardStatsResponse(
    long totalUsers,
    long pendingShops,
    long totalOrders,
    double totalRevenue,
    long totalProducts
) {}
