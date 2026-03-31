# API Conventions

## Base URL

All APIs are prefixed with:
/api

---

## Response Format

All responses must follow:

### Success

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
Error
{
  "success": false,
  "message": "Error message",
  "data": null
}

HTTP Methods
GET → retrieve data
POST → create
PUT → update
DELETE → remove
Endpoint Naming

Use RESTful naming.

Examples:

Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
Product
GET /api/products
GET /api/products/{id}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
Category
GET /api/categories
Cart
GET /api/cart
POST /api/cart
DELETE /api/cart/{itemId}
Order
POST /api/orders/checkout
GET /api/orders
GET /api/orders/{id}
Validation
Use request DTOs
Validate using annotations
Return clear error messages
Security (Future)
JWT will be used
Public endpoints:
register
login
product browsing
Protected endpoints:
cart
order
shop management
Pagination (Future)

For list endpoints:


GET /api/products?page=1&size=10

Error Handling
Use GlobalExceptionHandler
Return consistent error format
Do not expose stack traces in API response