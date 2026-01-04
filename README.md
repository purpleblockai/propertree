# Propertree - Property Management Platform

A comprehensive Airbnb-style property management platform built with Django REST Framework and React. Propertree enables landlords and property operators to manage short-term and long-term rentals with a unified portal for landlords/tenants and a separate admin portal.

## Features

### Core Functionality
- **Multi-role Authentication**: Landlord, Tenant, and Admin roles with JWT authentication
- **Property Management**: Complete CRUD operations for properties with images, amenities, and pricing
- **Booking System**: Search, book, approve/reject reservations with calendar integration
- **Property Expenses Tracking**: Track operating costs (utilities, taxes, insurance, maintenance, etc.)
- **Maintenance Management**: Service request tracking, service catalog, provider assignment, and resolution
- **Service Catalog**: Pre-defined services for landlords to book (plumbing, electrical, cleaning, etc.)
- **Analytics Dashboard**: Comprehensive KPIs for landlords and admins with income vs expenses tracking
- **Multi-language Support**: Internationalization (i18n) with support for English, Spanish, German, French, Italian, and Portuguese

### Key Features
- Advanced property search with filters (location, price, dates, amenities, property type)
- Property approval workflow (draft → pending → approved/rejected)
- Host onboarding wizard (11-step process for property listing)
- Favorite properties system
- Property performance tracking and comparison
- Monthly cash flow analysis (income vs expenses)
- Annual expenses summary by category
- Service booking system with admin approval
- Maintenance scheduling and tracking
- Responsive design with modern UI

## Tech Stack

### Backend
- **Django 5.0.1** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **JWT Authentication** - Secure token-based auth
- **Celery & Redis** - Async task processing
- **Pillow** - Image processing

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Recharts** - Data visualization

## Project Structure

```
propertree/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── propertree/          # Main project settings
│   ├── users/               # User authentication & profiles
│   ├── properties/          # Property management & expenses
│   ├── bookings/            # Bookings & reservations
│   ├── maintenance/         # Maintenance requests & service catalog
│   └── analytics/           # Dashboard KPIs & analytics
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── contexts/       # React contexts (Auth)
│   │   └── utils/           # Utility functions
│   └── package.json
├── render.yaml              # Deployment configuration
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.10+
- PostgreSQL 14+
- Node.js 18+
- Redis (for Celery)

### Backend Setup

1. **Clone the repository**
```bash
cd d:\PurpleBlock\Propertree\backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Create PostgreSQL database**
```sql
CREATE DATABASE propertree_db;
CREATE USER postgres WITH PASSWORD 'your_password';
ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE propertree_db TO postgres;
```

6. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Create superuser**
```bash
python manage.py createsuperuser
```

8. **Load initial data (optional)**
```bash
python manage.py loaddata fixtures/amenities.json
```

9. **Run development server**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the frontend directory:
```bash
VITE_API_URL=http://localhost:8000
```

4. **Run development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173/`

5. **Build for production**
```bash
npm run build
```

## API Documentation

### Authentication Endpoints
```
POST   /api/auth/register/              - User registration
POST   /api/auth/login/                 - User login
POST   /api/auth/logout/                - User logout
POST   /api/auth/refresh/               - Refresh JWT token
GET    /api/auth/profile/               - Get user profile
PUT    /api/auth/profile/               - Update user profile
POST   /api/auth/password/change/       - Change password
POST   /api/auth/password/reset/        - Request password reset
POST   /api/auth/password/reset/confirm/ - Confirm password reset
GET    /api/auth/verify-email/<token>/  - Verify email
POST   /api/auth/resend-verification/   - Resend verification email
```

### Property Endpoints
```
GET    /api/properties/                 - List all properties (public/search)
POST   /api/properties/                 - Create property (landlord)
GET    /api/properties/<id>/            - Get property detail
PUT    /api/properties/<id>/            - Update property (landlord)
DELETE /api/properties/<id>/            - Delete property (landlord)
GET    /api/properties/landlord/        - Get landlord's properties
POST   /api/properties/landlord/create/ - Create property (landlord)
PUT    /api/properties/landlord/<id>/   - Update property (landlord)
POST   /api/properties/landlord/<id>/submit/ - Submit for approval
GET    /api/properties/favorites/       - List favorite properties
POST   /api/properties/favorites/       - Add favorite property
DELETE /api/properties/favorites/<id>/  - Remove favorite property
GET    /api/properties/expenses/        - List property expenses
POST   /api/properties/expenses/create/ - Create expense
GET    /api/properties/expenses/<id>/    - Get expense detail
GET    /api/properties/<id>/expenses/   - Get expenses for a property
```

### Booking Endpoints
```
GET    /api/bookings/                   - List bookings (tenant)
POST   /api/bookings/create/            - Create booking (tenant)
GET    /api/bookings/<id>/              - Get booking detail
PUT    /api/bookings/<id>/status/       - Update booking status
POST   /api/bookings/<id>/cancel/       - Cancel booking (tenant)
GET    /api/bookings/landlord/          - List landlord's bookings
GET    /api/bookings/landlord/<id>/     - Get landlord booking detail
GET    /api/bookings/admin/             - List all bookings (admin)
GET    /api/bookings/admin/<id>/        - Get admin booking detail
POST   /api/bookings/admin/<id>/confirm/ - Confirm booking (admin)
POST   /api/bookings/admin/<id>/reject/  - Reject booking (admin)
```

### Maintenance Endpoints
```
GET    /api/maintenance/                - List maintenance requests
POST   /api/maintenance/                - Create maintenance request
GET    /api/maintenance/<id>/           - Get maintenance detail
PUT    /api/maintenance/<id>/           - Update maintenance request
GET    /api/maintenance/providers/      - List service providers
GET    /api/maintenance/schedules/      - List maintenance schedules
POST   /api/maintenance/schedules/      - Create maintenance schedule
GET    /api/maintenance/service-catalog/ - List service catalog
GET    /api/maintenance/service-catalog/<id>/ - Get service detail
GET    /api/maintenance/service-bookings/ - List service bookings
POST   /api/maintenance/service-bookings/ - Create service booking
GET    /api/maintenance/service-bookings/<id>/ - Get service booking
PUT    /api/maintenance/service-bookings/<id>/ - Update service booking
DELETE /api/maintenance/service-bookings/<id>/ - Delete service booking
```

### Admin Endpoints
```
GET    /api/admin/dashboard/stats/      - Admin dashboard statistics
GET    /api/admin/dashboard/analytics/  - Admin analytics
GET    /api/admin/analytics/performance/ - Asset performance analytics
GET    /api/admin/properties/pending/   - List pending properties
GET    /api/admin/properties/all/       - List all properties
GET    /api/admin/properties/filter-options/ - Property filter options
POST   /api/admin/properties/<id>/approve/ - Approve property
POST   /api/admin/properties/<id>/reject/  - Reject property
DELETE /api/admin/properties/<id>/delete/  - Delete property
GET    /api/admin/users/                - List all users
```

### Analytics Endpoints
```
GET    /api/analytics/landlord/dashboard/ - Landlord dashboard KPIs
GET    /api/analytics/admin/dashboard/    - Admin dashboard KPIs
```

## Database Models

### Core Models
- **CustomUser**: Extended user model with roles (landlord, tenant, admin) and email-based authentication
- **Profile**: Extended user profile information (first name, last name, phone, photo, bio)
- **AdminProfile**: Separate profile model for admin users
- **Property**: Property listings with location, pricing, amenities, photos (JSON), and approval workflow
- **PropertyExpense**: Operating expenses tracking (utilities, taxes, insurance, HOA fees, maintenance, etc.)
- **Favorite**: User favorite properties
- **Booking**: Property reservations with status management (pending, confirmed, cancelled, completed)
- **ServiceCatalog**: Pre-defined services available for booking (plumbing, electrical, cleaning, etc.)
- **ServiceProvider**: Service provider information with ratings
- **MaintenanceRequest**: Service requests with assignment, resolution tracking, and service booking integration
- **MaintenanceSchedule**: Scheduled maintenance tasks with frequency
- **MaintenanceImage**: Images attached to maintenance requests

## KPIs & Analytics

### Landlord Dashboard
- **Total Properties**: Count by status (approved, pending, draft)
- **Occupancy Rate**: Calculated based on booked days vs available days
- **Rental Income**: Total income from confirmed bookings
- **Pending Bookings**: Count and total value of pending bookings
- **Maintenance Costs**: Total costs from resolved requests and confirmed service bookings
- **Property Expenses**: Operating expenses by category (utilities, taxes, insurance, etc.)
- **Net Operating Income (NOI)**: Revenue minus operating expenses
- **Monthly Cash Flow**: Income vs expenses over time
- **Property Performance**: Individual property metrics (income, expenses, net income, booking count)
- **Average Booking Duration**: Average nights per booking
- **Annual Expenses Summary**: Expenses by category for a given year

### Admin Dashboard
- **Open Maintenance Tickets**: Count of open/assigned/in-progress tickets
- **Average Resolution Time**: Average hours to resolve maintenance requests
- **Platform-wide Occupancy Ratio**: Percentage of properties currently occupied
- **Rent Collection Rate**: Percentage of rent collected vs due
- **Platform Statistics**: Total users, landlords, tenants, properties, bookings
- **Property Analytics**: Platform-wide property metrics
- **Asset Performance**: Performance tracking across all properties

## Design System

### Color Palette
- **Primary Green**: #6B8E6F
- **Secondary Blue-gray**: #7B95A8
- **Neutral Cream**: #F5F0E8
- **Dark**: #2C3E3A

### Typography
- **Primary Font**: Plus Jakarta Sans

### UI Style
- Minimal & Clean
- Rounded corners
- Card-based layouts
- Subtle shadows
- Professional SaaS aesthetics

## Development Roadmap

### Phase 1: Backend Development ✅
- [x] Django project setup
- [x] User authentication system with JWT
- [x] Property management with approval workflow
- [x] Booking system with status management
- [x] Property expenses tracking
- [x] Maintenance management
- [x] Service catalog and service bookings
- [x] Analytics & KPIs
- [x] Multi-language support (i18n)

### Phase 2: Frontend Development ✅
- [x] React project setup with Vite
- [x] Authentication pages (Login, Register, Forgot Password)
- [x] Property search & listing with filters
- [x] Property detail page with booking
- [x] Host onboarding wizard (11 steps)
- [x] Landlord dashboard with analytics
- [x] Property management (list, create, edit)
- [x] Bookings management
- [x] Services management (service catalog, bookings)
- [x] Expenses management
- [x] Tenant portal (bookings, favorites)
- [x] Admin portal (dashboard, users, properties, bookings, service bookings, analytics)

### Phase 3: Advanced Features (Future Enhancements)
- [ ] Real-time chat/messaging
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Calendar synchronization (Google Calendar, iCal)
- [ ] Email notifications (transactional emails)
- [ ] PDF report generation
- [ ] Mobile app (React Native)
- [ ] Advanced search filters (map view, saved searches)
- [ ] Review and rating system

### Phase 4: Deployment ✅
- [x] Render.com deployment configuration
- [x] Production-ready settings
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Performance optimization
- [ ] Monitoring and logging

## Testing

```bash
# Run backend tests
cd backend
python manage.py test

# Run frontend linting
cd frontend
npm run lint
```

## Deployment

The project is configured for deployment on Render.com. See `render.yaml` for deployment configuration.

### Environment Variables

**Backend (.env):**
- `SECRET_KEY`: Django secret key
- `DEBUG`: Set to False in production
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: PostgreSQL database credentials
- `CELERY_BROKER_URL`: Redis URL for Celery
- `EMAIL_*`: Email configuration for notifications

**Frontend (.env):**
- `VITE_API_URL`: Backend API URL

## Contributing

This is a private project. For questions or issues, please contact the development team.

## License

Proprietary - All rights reserved

## Support

For support, please contact: support@propertree.com

---

**Built with ❤️ using Django REST Framework and React**
