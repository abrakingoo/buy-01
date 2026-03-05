# Buy-01 Angular Frontend

Modern Angular 18 SPA for the Buy-01 e-commerce platform with JWT authentication, role-based access control, and microservices integration.

## Features

- **Authentication**: JWT-based login/register with role selection (CLIENT/SELLER)
- **Guards**: AuthGuard for protected routes, RoleGuard for role-based access
- **Interceptors**: AuthInterceptor for JWT token attachment, ErrorInterceptor for global error handling
- **Services**: Auth, Product, and Media services for API communication
- **Pages**: Login, Register, Products, Product Detail, Seller Dashboard, Media Manager, Profile
- **Responsive Design**: Mobile-first CSS with grid layouts

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Navigate to http://localhost:4200
```

## Build

```bash
# Production build
npm run build

# Output in dist/buy-01-frontend/
```

## Project Structure

```
src/
├── app/
│   ├── models/              # TypeScript interfaces
│   │   ├── auth.model.ts
│   │   ├── product.model.ts
│   │   └── media.model.ts
│   ├── services/            # API communication
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   └── media.service.ts
│   ├── guards/              # Route protection
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/        # HTTP interceptors
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   ├── pages/               # Page components
│   │   ├── login/
│   │   ├── register/
│   │   ├── products/
│   │   ├── product-detail/
│   │   ├── seller-dashboard/
│   │   ├── media-manager/
│   │   └── profile/
│   ├── app.component.ts     # Root component
│   ├── app.routes.ts        # Route definitions
│   └── app.config.ts        # App configuration
├── environments/            # Environment configs
├── styles.scss              # Global styles
└── main.ts                  # Entry point
```

## API Integration

Services communicate with the API Gateway at `http://localhost:8080/api`:

- **Auth**: `/auth/login`, `/auth/register`
- **Products**: `/products` (GET, POST, PUT, DELETE)
- **Media**: `/media/images` (POST, GET, DELETE)

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. AuthInterceptor attaches token to all requests
5. ErrorInterceptor handles 401/403 responses
6. AuthGuard protects authenticated routes
7. RoleGuard restricts seller-only pages

## Development

### Add a new page

```bash
# Create component
ng generate component pages/my-page

# Add route in app.routes.ts
{ path: 'my-page', loadComponent: () => import('./pages/my-page/my-page.component').then(m => m.MyPageComponent) }
```

### Add a new service

```bash
# Create service
ng generate service services/my-service
```

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --code-coverage
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/buy-01-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and run

```bash
docker build -t buy-01-frontend .
docker run -p 4200:80 buy-01-frontend
```

## Environment Variables

Create `.env` file in root:

```
NG_APP_API_URL=http://localhost:8080/api
```

## Troubleshooting

### Port 4200 already in use

```bash
ng serve --port 4300
```

### CORS errors

Ensure API Gateway has CORS configured for `http://localhost:4200`

### Token not persisting

Check browser localStorage and ensure cookies are enabled

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m 'feat: add my feature'`
3. Push: `git push origin feature/my-feature`
4. Open Pull Request

## License

MIT
