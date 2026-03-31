# AGENTS.md

## Project
Marketplace system for buying and selling used items through shops.

## Tech stack
- Backend: Java 21, Spring Boot
- Frontend: Next.js
- Database: PostgreSQL
- Auth: JWT planned, not implemented yet
- Payment: Mock only

## Repository structure
- `backend/`: Spring Boot backend
- `frontend/`: Next.js frontend
- `docs/`: architecture and product rules

## Current project status
- Backend base structure is already created
- Common response and exception handling are already set up
- A test endpoint is already working
- Do not recreate the project foundation
- Continue with incremental implementation only

## Read these first
Before making changes, read:
1. `docs/architecture.md`
2. `docs/business-rules.md`
3. `docs/api-conventions.md`

## How to work
- Understand the existing structure before editing
- Prefer minimal, safe changes
- Do not rewrite unrelated files
- Keep naming consistent with existing modules
- If adding a new module, follow the same package/folder structure already used
- Explain major design choices briefly in comments or commit summary

## Backend package structure
Use the existing package structure under `backend/src/main/java/com/marketplace/backend`:
- auth
- cart
- category
- comment
- common
- favorite
- order
- product
- shop
- user

Inside each module, prefer:
- controller
- dto
- entity
- repository
- service

## Backend rules
- Use layered architecture: controller -> service -> repository
- Keep controllers thin
- Put business logic in services
- Use DTOs for request/response
- Use constructor injection
- Use validation annotations for input
- Use global exception handling
- Use `ApiResponse<T>` for API responses
- Do not add unnecessary abstractions
- Do not introduce CQRS, event bus, or microservices for MVP
- For database changes, keep schema simple and MVP-friendly
- Only implement the module explicitly requested
- Do not generate or modify unrelated modules
- Do not create placeholder business logic for future modules unless requested

## Frontend rules
- Use Next.js App Router
- Separate UI components from API/client utilities
- Keep pages simple and composable
- Reuse shared types when practical
- Avoid premature optimization

## API response contract
Keep the existing response format:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}