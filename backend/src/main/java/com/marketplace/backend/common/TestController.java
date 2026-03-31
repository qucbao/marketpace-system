package com.marketplace.backend.common;

import com.marketplace.backend.common.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public ApiResponse<String> test() {
        return ApiResponse.ok("Backend is running", "OK");
    }
}