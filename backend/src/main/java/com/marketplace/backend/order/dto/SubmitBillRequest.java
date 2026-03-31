package com.marketplace.backend.order.dto;

public class SubmitBillRequest {
    private String billUrl;

    public SubmitBillRequest() {
    }

    public SubmitBillRequest(String billUrl) {
        this.billUrl = billUrl;
    }

    public String getBillUrl() {
        return billUrl;
    }

    public void setBillUrl(String billUrl) {
        this.billUrl = billUrl;
    }
}
