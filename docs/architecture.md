# Architecture

## Backend Overview

This project uses a **modular monolith architecture** with layered design.

Each domain module is separated into its own package.

## Package Structure

Base package:com.marketplace.backend

Modules:
- auth
- user
- shop
- product
- category
- comment
- favorite
- cart
- order
- common

## Layered Architecture

Each module should follow: controller → service → repository

### controller
- Handle HTTP requests and responses
- Call service layer
- No business logic

### service
- Contain business logic
- Validate rules
- Coordinate repository calls

### repository
- Data access layer
- Use Spring Data JPA

### entity
- JPA entities mapped to database tables

### dto
- Request and response objects
- Used for API communication

---

## Common Module

Located at:common/

Contains:
- config → application configuration (security, etc.)
- exception → global exception handler
- response → ApiResponse wrapper
- security → authentication logic (later JWT)
- util → helper utilities

---

## Backend Conventions

- Use constructor injection (`@RequiredArgsConstructor`)
- Use Lombok for boilerplate
- Use `@Transactional` in service layer where needed
- Do not expose entity directly in controller
- Use DTOs for API boundaries
- Use `ApiResponse<T>` as standard response format

---

## Frontend Architecture

Suggested structure:

src/
├── app/
├── components/
├── lib/
├── hooks/
├── types/


### Rules
- API calls go into `lib/`
- Pages should be simple
- Components should be reusable
- Avoid embedding business logic in UI

---

## Design Principles

- Keep code simple and readable
- Prefer explicit over clever abstractions
- Avoid premature optimization
- MVP first, scalability later


