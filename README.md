# Reminder App Backend

A scalable Node.js/Express backend API with TypeScript and Supabase integration.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration and Supabase setup
│   ├── controllers/
│   │   ├── userController.ts    # User-related business logic
│   │   └── dayPlanController.ts # Day plan and daily plan business logic
│   ├── middleware/
│   │   ├── errorHandler.ts      # Error handling and custom error classes
│   │   └── validation.ts        # Request validation middleware
│   ├── routes/
│   │   ├── index.ts            # Main router configuration
│   │   ├── userRoutes.ts       # User-related routes
│   │   ├── dayPlanRoutes.ts    # Day plan routes
│   │   └── dailyPlanRoutes.ts  # Daily plan routes
│   ├── services/
│   │   ├── userService.ts      # User database operations
│   │   └── dayPlanService.ts   # Day plan database operations
│   └── index.ts                # Main application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### User Management
- `POST /api/user/check` - Check if user exists, create if name provided
- `GET /api/user/:userId` - Get user by ID
- `PUT /api/user/:userId` - Update user
- `DELETE /api/user/:userId` - Delete user

### Day Plans
- `POST /api/plan_day` - Save day plan
- `GET /api/plan_day/:userId` - Get user's day plans
- `GET /api/plan_day/detail/:planId` - Get specific day plan
- `PUT /api/plan_day/:planId` - Update day plan
- `DELETE /api/plan_day/:planId` - Delete day plan

### Daily Plans
- `POST /api/addPlan` - Add daily plan with reminders
- `GET /api/getAllPlansForDate` - Get all plans for a specific date
- `PUT /api/updatePlan` - Update plan (for subgoal status changes)
- `GET /api/daily-plans/:userId` - Get user's daily plans

## 🛠️ Architecture

### Separation of Concerns
- **Routes**: Handle HTTP requests and responses
- **Controllers**: Business logic and request/response handling
- **Services**: Database operations and external API calls
- **Middleware**: Request validation, error handling, logging
- **Config**: Environment variables and database configuration

### Error Handling
- Custom `AppError` class for operational errors
- Global error handling middleware
- Consistent error response format
- Request logging for debugging

### Validation
- Input validation middleware for all endpoints
- Type-safe request/response interfaces
- Comprehensive error messages

## 🔧 Configuration

The application uses environment variables for configuration:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `PORT`: Server port (default: 3001)
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:3000)
- `NODE_ENV`: Environment (development/production)

## 📝 Database Schema

### Tables Used
- `User`: User information and authentication
- `day_plans`: Daily scheduling plans
- `user_daily_plans`: Detailed daily plans with reminders

## 🚀 Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Start the server:
```bash
npm start
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Add validation middleware
5. Update documentation

## 📄 License

MIT License
