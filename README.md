# Sales Commission Management System

A comprehensive sales commission management system built with Next.js, TypeScript, Better Auth, MongoDB, and shadcn/ui. This system provides complete functionality for managing sales teams, calculating commissions, and tracking performance across different user roles.

## 🎯 Features

### ✅ Completed Features

#### **Authentication & User Management**
- **Role-based Authentication** - Admin, Manager, Executive roles with proper permissions
- **User Registration** - Self-registration for executives
- **Profile Management** - Edit personal information, upload profile pictures
- **Password Management** - Change passwords, secure authentication
- **Admin User Management** - Create, edit, activate/deactivate users

#### **Executive Features**
- **Executive Dashboard** - Personal sales overview, performance metrics
- **Sales Management** - Add, edit, delete sales with status tracking
- **Profile Management** - View/edit personal info, phone, profile picture
- **Performance Tracking** - Real-time target achievement, commission preview
- **Sales History** - Complete sales record with filtering

#### **Manager Features**
- **Manager Dashboard** - Team overview, performance analytics
- **Commission Calculator** - Advanced commission calculation with detailed breakdowns
- **Commission Rules Management** - Create, edit, delete commission rules
- **Team Management** - View team members, assign targets
- **Performance Analytics** - Team performance metrics and insights

#### **Admin Features**
- **Admin Dashboard** - System-wide overview, all users and sales
- **User Management** - Create, edit, delete users across all roles
- **System Analytics** - Company-wide sales and commission tracking
- **Commission Oversight** - Calculate commissions for any user
- **System Configuration** - Manage commission rules globally

### 🔑 Core Business Logic
- **Commission Rules**: 80-89% = 1%, 90-99% = 2%, 100%+ = 3%
- **Target Achievement**: Automatic calculation based on sales vs target
- **Role-based Access**: Different dashboards and permissions per role
- **Real-time Calculations**: Dynamic commission computation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
cd sales
npm install
```

2. **Setup environment variables**
Create `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/sales-commission-system
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

3. **Start MongoDB**
Make sure MongoDB is running on your system

4. **Seed the database**
```bash
npm run seed
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open the application**
Visit [http://localhost:3000](http://localhost:3000)

## 👥 Demo Accounts

| Role | Email | Password | Employee ID |
|------|-------|----------|-------------|
| Admin | admin@company.com | admin123 | A001 |
| Manager | manager@company.com | manager123 | M001 |
| Executive | john@company.com | exec123 | E001 |
| Executive | jane@company.com | exec123 | E002 |
| Executive | mike@company.com | exec123 | E003 |

## 🎮 Demo Script

### 1. Login as Manager (30 seconds)
- Go to login page
- Use: manager@company.com / manager123
- Notice role-based redirect to manager dashboard

### 2. Manager Dashboard (1 minute)
- View team performance overview
- See John Doe with 120% achievement
- Click "Calculate" for John Doe

### 3. Commission Calculator (2 minutes) - STAR FEATURE
- View detailed commission calculation
- See sales breakdown and commission rules
- Notice 120% achievement = 3% commission rate
- Commission: $12,000 × 3% = $360

### 4. Switch to Admin (1 minute)
- Logout and login as admin@company.com / admin123
- View system-wide data
- Filter executives by manager
- Calculate commission for any executive

### 5. Executive Experience (1 minute)
- Login as john@company.com / exec123
- View personal dashboard
- Add a new sale
- See real-time performance updates

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Authentication**: Better Auth
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS with custom design system

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and configurations
├── models/                # MongoDB models
├── scripts/               # Database seeding
└── styles/               # Global styles
```

### Key Components
- **DashboardCard**: Reusable metric display
- **CommissionModal**: Detailed commission calculator
- **Role-based Layouts**: Different dashboards per role
- **API Routes**: RESTful endpoints for data management

## 📊 Database Models

### User
- name, email, password (hashed)
- role: admin | manager | executive
- employeeId, assignedManager, assignedTarget

### Sale
- salesExecutive, productName
- saleAmount, quantity, saleDate

### CommissionRule
- targetFrom, targetTo, commissionRate

### CommissionRecord
- salesExecutive, amount, calculatedBy
- calculationDate, salesTotal, targetAchievement, commissionRate

## 🎯 Business Logic

### Commission Calculation
```javascript
const achievement = (totalSales / target) * 100
const commissionRate = getCommissionRate(achievement)
const commission = totalSales * (commissionRate / 100)
```

### Commission Rules
- 80-89% target achievement → 1% commission
- 90-99% target achievement → 2% commission  
- 100%+ target achievement → 3% commission

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Railway, Netlify, or any Node.js hosting
- Ensure MongoDB connection string is configured

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

### Key Features Implemented
- ✅ Authentication & Authorization
- ✅ Role-based Access Control
- ✅ Commission Calculation Logic
- ✅ Sales Management (CRUD)
- ✅ Professional UI/UX
- ✅ Responsive Design
- ✅ Error Handling
- ✅ Loading States
- ✅ Data Validation

## 🎤 Interview Talking Points

### Technical Highlights
1. **Full-Stack Architecture**: Complete Next.js application with API routes
2. **Authentication**: Better Auth with role-based access control
3. **Database Design**: MongoDB with proper relationships and indexing
4. **Business Logic**: Complex commission calculation with dynamic rules
5. **UI/UX**: Professional interface with shadcn/ui components
6. **TypeScript**: Full type safety throughout the application

### Scalability Features
- Modular component architecture
- Role-based permissions system
- Configurable commission rules
- RESTful API design
- Database relationship modeling

### Production Ready
- Environment configuration
- Error handling and validation
- Loading states and user feedback
- Responsive design
- Security best practices

## 📈 Future Enhancements

While this is a 4-hour MVP, here are features that could be added:
- Image uploads for products
- Email notifications
- Advanced reporting and analytics
- Export functionality
- Mobile app
- Real-time notifications
- Advanced user management

---

**Built in 4 hours to demonstrate full-stack development skills, business logic implementation, and professional UI design. Perfect for technical interviews! 🚀**
#   s a l e s - I O M  
 