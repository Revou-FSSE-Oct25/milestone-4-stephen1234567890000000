# RevoBank API

A production-ready banking platform backend built with NestJS, featuring user authentication, account management, and transaction processing.

## Overview

RevoBank is a comprehensive banking API that provides secure financial operations for users. The system supports user registration, account creation, fund transfers, deposits, and withdrawals with JWT-based authentication and PostgreSQL database persistence.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (Passport.js)
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Linting**: ESLint

## Features

### Authentication & Authorization
- User registration with password hashing (bcrypt)
- JWT-based login and token management
- Protected endpoints with JWT Guard

### User Management
- User profile creation and updates
- Profile information management
- User data persistence

### Account Management
- Individual account creation per user
- Unique account number generation
- Balance tracking and updates
- Account information retrieval

### Transaction Processing
- Fund transfers between accounts
- Deposit operations
- Withdrawal operations
- Transaction history and record keeping
- Transaction type tracking

### API Documentation
- Auto-generated Swagger documentation
- Bearer token authentication in Swagger UI
- Available at `/api` endpoint

## Project Structure

```
revobank/
├── src/
│   ├── auth/                 # Authentication logic
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt.authGuard.ts
│   ├── user/                 # User management
│   │   ├── user.service.ts
│   │   └── user.controller.ts
│   ├── account/              # Account operations
│   │   ├── account.service.ts
│   │   └── account.controller.ts
│   ├── transaction/          # Transaction processing
│   │   ├── transaction.service.ts
│   │   └── transaction.controller.ts
│   ├── prisma/               # Database service
│   │   └── prisma.service.ts
│   ├── app.module.ts         # Root module
│   ├── app.controller.ts     # Root controller
│   └── main.ts               # Application entry point
├── prisma/
│   └── schema.prisma         # Database schema
├── test/                     # E2E tests
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL 12.x or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd milestone-4-stephen1234567890000000
```

2. Navigate to project directory:
```bash
cd revobank
```

3. Install dependencies:
```bash
npm install
```

4. Configure environment variables:
```bash
cp .env.example .env
```

Update `.env` with actual values:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/revobank"
JWT_SECRET="your-secret-key-here"
PORT=3000
```

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Run database migrations:
```bash
npx prisma migrate deploy
```

### Running the Application

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

**Watch mode with debugging:**
```bash
npm run start:debug
```

## API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/api
```

### Core Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /user/:id` - Get user profile
- `PUT /user/:id` - Update user profile
- `POST /account` - Create account
- `GET /account/:id` - Get account details
- `POST /transaction/transfer` - Transfer funds
- `POST /transaction/deposit` - Deposit funds
- `POST /transaction/withdraw` - Withdraw funds
- `GET /transaction/:id` - Get transaction details

## Testing

### Unit Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:cov
```

### End-to-End Tests
```bash
npm run test:e2e
```

## Database Schema

### Models

- **User**: User account information and authentication
- **Account**: Bank accounts linked to users
- **Transaction**: Financial transactions (transfers, deposits, withdrawals)

Database relationships are configured in `prisma/schema.prisma` with full constraints and indexes for performance.

## Deployment

### Railway Deployment

1. Create a Railway project
2. Connect GitHub repository
3. Configure environment settings:
   - Root Directory: `revobank/`
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`

4. Set environment variables in Railway dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT` (optional, defaults to 3000)

5. Deploy

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Format code with Prettier:
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Adding Migrations
After schema changes:
```bash
npx prisma migrate dev --name <migration-name>
```

## Environment Configuration

The application uses `@nestjs/config` for environment variable management. All sensitive data should be defined in the `.env` file and never committed to version control.

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing

Optional variables:
- `PORT` - Server port (default: 3000)

## Error Handling

The API implements comprehensive error handling with:
- Input validation via class-validator
- HTTP exception filters
- Proper status codes and error messages
- Detailed error logs in development

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected endpoints with authentication guards
- Input validation and sanitization
- CORS enabled for cross-origin requests
- Environment variable management

## Performance Considerations

- Database indexing on frequently queried fields
- Prisma connection pooling
- Pagination support for large datasets
- Optimized database queries

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` format
- Ensure PostgreSQL service is running
- Check database credentials and accessibility

### Build Failures
- Clean dependencies: `rm -rf node_modules package-lock.json && npm install`
- Regenerate Prisma client: `npx prisma generate`
- Check Node.js version compatibility

### Migration Issues
- Review pending migrations: `npx prisma migrate status`
- Reset database (development only): `npx prisma migrate reset`

## License

UNLICENSED

## Support

For issues or questions, contact the development team or create an issue in the repository.
