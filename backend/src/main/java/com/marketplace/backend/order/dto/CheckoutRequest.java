package com.marketplace.backend.order.dto;

import com.marketplace.backend.order.entity.CheckoutType;
import jakarta.validation.constraints.NotNull;

public class CheckoutRequest {

    @NotNull(message = "Checkout type is required")
    private CheckoutType checkoutType;

    public CheckoutRequest() {
    }

    public CheckoutType getCheckoutType() {
        return checkoutType;
    }

    public void setCheckoutType(CheckoutType checkoutType) {
        this.checkoutType = checkoutType;
    }
}
