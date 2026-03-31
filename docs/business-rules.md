# Business Rules

## Roles

There are 3 roles in the system:

- USER → buyer
- SHOP → seller (owned by a user)
- ADMIN → system administrator

---

## Shop

- A user can register to become a shop
- Shop must be approved by admin

### Shop status
- PENDING
- APPROVED
- REJECTED

### Rules
- Only APPROVED shops can create products

---

## Product

A product belongs to a shop.

### Product includes:
- multiple images
- description
- condition
- price
- category

### Product status
- ACTIVE → available for sale
- SOLD → already sold
- HIDDEN → not visible

### Rules
- Cannot purchase a product with status SOLD
- Only shop owner can update/delete product

---

## Category

- Products can belong to one or multiple categories
- Categories are predefined

---

## Cart

- A user can add products to cart

### Rules
- Do not allow duplicate product entries
- If product already exists → increase quantity OR reject consistently
- Cart belongs to a user

---

## Checkout

There are 2 checkout types:

1. PICKUP
2. DELIVERY

---

## Order

An order is created from cart items.

### Order status
- PENDING
- PAID_DEPOSIT
- COMPLETED
- CANCELLED

### Rules
- Cannot create order with SOLD products
- Each order belongs to one shop

---

## Payment (Mock)

No real payment integration.

### Rules
- DELIVERY requires 20% deposit
- PICKUP requires no deposit

---

## Comment

- Users can comment on products

### Rules
- No reply
- No edit
- No delete

---

## Favorite

- Users can favorite products

---

## Permissions

- Users can only modify their own resources
- Shop actions require shop ownership
- Admin can approve/reject shops