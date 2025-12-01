# Propertree - Property Management Platform

A comprehensive Airbnb-style property management platform built with Django REST Framework and React. Propertree enables landlords and property operators to manage short-term and long-term rentals with a unified portal for landlords/tenants and a separate admin portal.

## Features

### Core Functionality
- **Multi-role Authentication**: Landlord, Tenant, and Admin roles with JWT authentication
- **Property Management**: Complete CRUD operations for properties with images, amenities, and pricing
- **Booking System**: Search, book, approve/reject reservations with calendar integration
- **Payment Processing**: Payment tracking, invoicing, and financial reporting
- **Maintenance Management**: Service request tracking, provider assignment, and resolution
- **Communication**: In-platform messaging and notification system
- **Analytics Dashboard**: Comprehensive KPIs for landlords and admins

### Key Features
- Advanced property search with filters (location, price, dates, amenities)
- Dynamic pricing by date/season
- Cancellation policies with automated refund calculations
- Review and rating system
- Favorite properties
- Maintenance scheduling
- Email notifications
- Responsive design

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
│   ├── properties/          # Property management
│   ├── bookings/            # Bookings & payments
│   ├── maintenance/         # Maintenance requests
│   ├── communications/      # Messages & notifications
│   └── analytics/           # Dashboard KPIs
├── frontend/                # React application (to be created)
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

### Frontend Setup (Coming in Phase 2)
```bash
cd frontend
npm install
npm start
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
GET    /api/properties/                 - List all properties
POST   /api/properties/                 - Create property
GET    /api/properties/<id>/            - Get property detail
PUT    /api/properties/<id>/            - Update property
DELETE /api/properties/<id>/            - Delete property
GET    /api/properties/my-properties/   - Get landlord's properties
POST   /api/properties/<id>/images/     - Upload property images
GET    /api/properties/amenities/       - List all amenities
GET    /api/properties/favorites/       - List favorite properties
POST   /api/properties/favorites/       - Add favorite property
DELETE /api/properties/favorites/<id>/  - Remove favorite property
```

### Booking Endpoints
```
GET    /api/bookings/                   - List bookings
POST   /api/bookings/                   - Create booking
GET    /api/bookings/<id>/              - Get booking detail
PUT    /api/bookings/<id>/              - Update booking
POST   /api/bookings/<id>/cancel/       - Cancel booking
POST   /api/bookings/<id>/approve/      - Approve booking (landlord)
POST   /api/bookings/<id>/reject/       - Reject booking (landlord)
```

### Payment Endpoints
```
GET    /api/bookings/payments/          - List payments
POST   /api/bookings/payments/          - Create payment
GET    /api/bookings/payments/<id>/     - Get payment detail
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
```

### Communication Endpoints
```
GET    /api/messages/                   - List messages
POST   /api/messages/                   - Send message
GET    /api/messages/<id>/              - Get message detail
GET    /api/messages/notifications/     - List notifications
POST   /api/messages/notifications/<id>/read/ - Mark notification as read
POST   /api/messages/notifications/read-all/  - Mark all as read
```

### Analytics Endpoints
```
GET    /api/analytics/landlord/dashboard/ - Landlord dashboard KPIs
GET    /api/analytics/admin/dashboard/    - Admin dashboard KPIs
```

## Database Models

### Core Models
- **CustomUser**: Extended user model with roles (landlord, tenant, admin)
- **Profile**: Extended user profile information
- **Property**: Property listings with location, pricing, and amenities
- **PropertyImage**: Property photos
- **Amenity**: Available amenities (WiFi, parking, etc.)
- **Booking**: Property reservations
- **Payment**: Payment tracking
- **Review**: Property and user reviews
- **MaintenanceRequest**: Service requests
- **Message**: In-platform messaging
- **Notification**: System notifications

## KPIs & Analytics

### Landlord Dashboard
- Occupancy Rate
- Rental Income
- Rent Default Rate
- Maintenance Costs
- Tenant Satisfaction
- Renewal Rate
- Average Contract Duration
- Net Operating Income (NOI)
- Tenant Turnover Rate

### Admin Dashboard
- Open Maintenance Tickets
- Average Resolution Time
- Platform-wide Occupancy Ratio
- Rent Collection Rate
- Platform Statistics

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
- [x] User authentication system
- [x] Property management
- [x] Booking system
- [x] Payment tracking
- [x] Maintenance management
- [x] Communication system
- [x] Analytics & KPIs

### Phase 2: Frontend Development (In Progress)
- [ ] React project setup
- [ ] Authentication pages
- [ ] Property search & listing
- [ ] Booking flow
- [ ] Landlord dashboard
- [ ] Tenant portal
- [ ] Admin portal

### Phase 3: Advanced Features
- [ ] Real-time chat
- [ ] Payment gateway integration
- [ ] Calendar synchronization
- [ ] Mobile responsiveness
- [ ] Email notifications
- [ ] PDF report generation

### Phase 4: Deployment
- [ ] Docker configuration
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Performance optimization

## Testing

```bash
# Run backend tests
cd backend
python manage.py test

# Run frontend tests
cd frontend
npm test
```

## Contributing

This is a private project. For questions or issues, please contact the development team.

## License

Proprietary - All rights reserved

## Support

For support, please contact: support@propertree.com

---

**Built with ❤️ using Django REST Framework and React**
