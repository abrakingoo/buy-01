# Angular Frontend - Quick Start Guide

## Setup

```bash
cd frontend
npm install
npm start
```

Navigate to `http://localhost:4200`

## Architecture Overview

### Authentication Flow
- **AuthService**: Manages login, register, token storage, and user state
- **AuthInterceptor**: Automatically attaches JWT token to all HTTP requests
- **ErrorInterceptor**: Handles 401/403 errors and redirects to login
- **AuthGuard**: Protects routes requiring authentication
- **RoleGuard**: Restricts routes by user role (SELLER/CLIENT)

### Services
- **AuthService**: User authentication and profile management
- **ProductService**: Product CRUD operations with pagination
- **MediaService**: Image upload/download with validation (2MB, image/* only)

### Pages
- **Login/Register**: Authentication with role selection
- **Products**: Browse all products with pagination
- **Product Detail**: View product details and images
- **Seller Dashboard**: Create, update, delete products (SELLER only)
- **Media Manager**: Upload and manage product images (SELLER only)
- **Profile**: View and update user profile

## Key Features

### JWT Authentication
```typescript
// Token automatically attached to requests
Authorization: Bearer <token>

// Stored in localStorage
localStorage.getItem('token')
```

### Role-Based Access
```typescript
// Routes protected by role
{
  path: 'seller',
  canActivate: [AuthGuard, RoleGuard],
  data: { role: 'SELLER' }
}
```

### Error Handling
```typescript
// Global error handling in ErrorInterceptor
- 401: Logout and redirect to login
- 403: Redirect to home
- Other: Pass to component
```

### File Upload Validation
```typescript
// MediaService validates before upload
- MIME types: image/jpeg, image/png, image/gif, image/webp
- Max size: 2MB
- Filename sanitization
```

## API Endpoints

All requests go through API Gateway at `http://localhost:8080/api`

### Auth
- `POST /auth/login` - Login with email/password
- `POST /auth/register` - Register with email/password/role

### Products
- `GET /products?page=0&size=20` - List products
- `GET /products/{id}` - Get product details
- `POST /products` - Create product (SELLER)
- `PUT /products/{id}` - Update product (SELLER)
- `DELETE /products/{id}` - Delete product (SELLER)

### Media
- `POST /media/images` - Upload image (SELLER)
- `GET /media/images/{id}` - Download image
- `DELETE /media/images/{id}` - Delete image (SELLER)

## Development Tips

### Add a new page
1. Create component in `src/app/pages/`
2. Add route in `app.routes.ts`
3. Use guards if needed

### Add a new service
1. Create service in `src/app/services/`
2. Inject in components via constructor
3. Use RxJS observables for async operations

### Debugging
- Open DevTools (F12)
- Check Network tab for API calls
- Check Application tab for localStorage/tokens
- Check Console for errors

## Environment Configuration

### Development
```typescript
// src/environments/environment.ts
apiUrl: 'http://localhost:8080/api'
```

### Production
```typescript
// src/environments/environment.prod.ts
apiUrl: 'https://api.buy-01.com/api'
```

## Common Issues

### CORS errors
- Ensure API Gateway has CORS configured for `http://localhost:4200`
- Check `application.yml` in gateway service

### Token not persisting
- Check browser localStorage
- Verify AuthService is storing token correctly
- Check browser console for errors

### 401 Unauthorized
- Token may have expired
- Try logging out and logging back in
- Check token format in Authorization header

### Port 4200 in use
```bash
ng serve --port 4300
```

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Register a new account (CLIENT or SELLER)
4. Browse products or create products (if SELLER)
5. Upload images to products (if SELLER)

## Resources

- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io/)
