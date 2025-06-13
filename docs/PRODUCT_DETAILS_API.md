# Product Details API

This module provides functionality to store and retrieve product details for companies, linking them via their Instagram IDs.

## Schema

The `ProductDetailsSchema` contains:
- `company_instagram_id` (String, required) - Links to the company's Instagram ID
- `text_content` (String, required, max 5000 chars) - The product description/details
- `createdAt` and `updatedAt` timestamps (auto-generated)

## API Endpoints

### POST /api/product-details
Create new product details entry.

**Request Body:**
```json
{
  "company_instagram_id": "company_instagram_handle",
  "text_content": "Detailed product information..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product details created successfully",
  "data": {
    "id": "...",
    "company_instagram_id": "company_instagram_handle",
    "text_content": "Detailed product information...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation Checks:**
- Both fields are required and non-empty
- `company_instagram_id` must be a valid string
- `text_content` cannot exceed 5000 characters
- Company must exist in the database

### GET /api/product-details
Retrieve product details with optional filtering and pagination.

**Query Parameters:**
- `company_instagram_id` (optional) - Filter by specific company
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10, max: 100) - Items per page
- `sortBy` (optional, default: "createdAt") - Field to sort by
- `sortOrder` (optional, default: "desc") - Sort order (asc/desc)

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### GET /api/product-details/test
Test endpoint to verify API functionality and database connection.

## Error Handling

The API provides comprehensive error handling:

- **400 Bad Request**: Validation errors, invalid parameters
- **404 Not Found**: Company not found
- **409 Conflict**: Duplicate entries (if applicable)
- **500 Internal Server Error**: Database or server errors

Error responses include:
```json
{
  "success": false,
  "error": "Error description",
  "details": ["Specific validation errors..."]
}
```

## Frontend Integration

The product details page (`/product-details`) has been updated to:
1. Save content to the database before sending to webhook
2. Display previously saved product details
3. Allow loading saved content back into the text editor
4. Show real-time status and pagination

## Database Indexing

The schema includes optimized indexing:
- Compound index on `company_instagram_id` and `createdAt` for efficient queries
- Individual index on `company_instagram_id` for filtering

## Security Considerations

- Input validation and sanitization
- Rate limiting (recommended to add)
- Authentication checks for company existence
- SQL injection prevention through Mongoose ODM
- XSS prevention through input sanitization

## Usage Example

```javascript
// Save product details
const response = await fetch('/api/product-details', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company_instagram_id: 'mycompany_insta',
    text_content: 'Our premium product line includes...'
  })
});

// Fetch company's product details
const details = await fetch('/api/product-details?company_instagram_id=mycompany_insta');
```

## Files Created/Modified

- `models/ProductDetailsSchema.ts` - Database schema
- `app/api/product-details/route.ts` - Main API routes
- `app/api/product-details/test/route.ts` - Test endpoint
- `types/productDetails.ts` - TypeScript interfaces
- `app/(protected)/product-details/page.tsx` - Updated frontend integration
