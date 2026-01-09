# Propertree Architecture
Document Version: 1.2
Last Updated: 2026-01-05
Prepared for: Client
Prepared by: PurpleBlock Consulting LLP

## 1. Executive Summary
Propertree is a full-stack property management platform that supports tenants, landlords, and administrators in a unified system. The product is a React single-page application backed by a Django REST API and a PostgreSQL database. It supports property listing workflows, booking and approval flows, expense tracking, maintenance management, and analytics dashboards.

This document describes the system as implemented in the repository. It is intended for client review and provides a detailed, accurate view of the current architecture, capabilities, and scope boundaries.

## 2. Scope and Audience

### 2.1 Audience
- Business stakeholders who need a clear overview of capabilities and flows.
- Technical stakeholders who need to understand system composition and integration points.

### 2.2 Scope Boundaries
- This document covers the current codebase, deployment configuration, and runtime behavior.
- Future items are explicitly marked as not implemented.

## 3. System Context

### 3.1 Actors
- Tenant: search properties, book stays, manage bookings and favorites.
- Landlord: create and manage listings, approve bookings (when configured), track expenses, and request services.
- Admin: approve listings, manage users, confirm bookings for admin-approval listings, and view platform analytics.

### 3.2 External Systems
- PostgreSQL database (primary data store).
- Redis (optional, configured for Celery broker and results).
- SMTP email provider (configurable).
- Render hosting (production deployment).

### 3.3 Topology

```
Browsers
  |
  | HTTPS
  v
Frontend (React static site)
  |
  | HTTPS (REST)
  v
Backend API (Django REST Framework)
  |
  +--> PostgreSQL (data)
  +--> Redis (Celery broker/result, optional)
  +--> SMTP (email)
```

## 4. Architecture at a Glance

### 4.1 Components
- Frontend: React SPA with role-based routes and dashboards.
- Backend: Django REST API with modular apps for each domain area.
- Data: PostgreSQL with UUID primary keys and JSON fields for flexible content.
- Async: Celery configured, currently no task modules defined.
- Integrations: SMTP and Redis are optional, configured by environment variables.

### 4.2 Typical Request Flow
1) User loads the React SPA from the static host.
2) SPA authenticates via `/api/auth/login/` and stores JWT tokens.
3) API requests include `Authorization: Bearer <token>`.
4) Backend authorizes the request, applies filters and pagination, and returns JSON.
5) The UI renders data and updates cached state.

## 5. Backend Architecture

### 5.1 Stack and Runtime
- Python 3.11, Django 5.0.1, Django REST Framework.
- PostgreSQL database configured in `backend/propertree/settings.py`.
- JWT authentication via `rest_framework_simplejwt`.
- CORS configured for local development and Render subdomains.

### 5.2 Repository Layout (Backend)
- `backend/manage.py` - Django entrypoint.
- `backend/propertree/` - settings, URL routing, WSGI/ASGI entrypoints, Celery config.
- `backend/users/` - custom user model and profile management.
- `backend/properties/` - listings, approval workflow, expenses, favorites, admin endpoints.
- `backend/bookings/` - reservation lifecycle and approval rules.
- `backend/maintenance/` - maintenance requests, service catalog, schedules, service bookings.
- `backend/analytics/` - KPI calculations and dashboard endpoints.
- `backend/communications/` - message/notification models (not wired into URLs).
- `backend/requirements.txt` - dependency list.

### 5.3 Core Configuration
- `INSTALLED_APPS` includes: `users`, `properties`, `bookings`, `maintenance` plus DRF and CORS.
- `MIDDLEWARE` includes CORS, sessions, CSRF, auth, and security middleware.
- REST framework defaults:
  - Authentication: JWT only.
  - Permissions: `IsAuthenticatedOrReadOnly`.
  - Pagination: page size 20.
  - Filtering: Django filter backend, search, ordering.
  - Renderer: JSON only.
- JWT settings:
  - Access token lifetime: 1 hour.
  - Refresh token lifetime: 7 days.
  - Rotation and blacklist enabled.

### 5.4 Authentication and Authorization
- Custom user model: `CustomUser` with email login and role field (`tenant`, `landlord`, `admin`).
- Profiles:
  - `Profile` for tenant/landlord identity details.
  - `AdminProfile` for admin details.
- Registration supports JSON and multipart form data with nested `profile.*` fields.
- Profile updates support nested `profile.*` or `admin_profile.*` fields.
- JWT tokens are required for most non-public endpoints.
- Admin-only checks are enforced in admin-specific views.

### 5.5 Domain Modules and Behavior

#### Users
- Registration creates a user and a profile based on role.
- Login returns user data and access/refresh tokens.
- Profile endpoint supports `GET`, `PUT`, and `PATCH` with multipart data.

#### Properties
- `Property` status lifecycle: `draft`, `pending_approval`, `approved`, `rejected`, `booked`.
- Approval is tracked by `approved_by` (admin) and `approved_at`.
- `approval_type` controls who confirms bookings (landlord or admin).
- Public listing only returns `approved` properties.
- Filtering supports: property type, location, bedrooms, bathrooms, price range, guests.
- Availability search excludes properties with overlapping pending/confirmed bookings.

#### Expenses
- `PropertyExpense` tracks operating costs with categories and optional recurrence.
- Expense creation validates that the property belongs to the landlord.

#### Favorites
- Favorites are unique per `(user, property)` to prevent duplicates.

#### Bookings
- Booking creation validates:
  - Check-in date not in the past.
  - Check-in is before check-out.
  - Property is approved and available for dates.
- Status lifecycle: `pending`, `confirmed`, `cancelled`, `completed`.
- Landlord confirmations are allowed only when `approval_type` is `landlord`.
- Admin confirmations are allowed only when `approval_type` is `admin`.

#### Maintenance and Services
- `MaintenanceRequest` includes priority, category, status, and optional provider assignment.
- `ServiceCatalog` defines predefined services with pricing and duration.
- Service bookings are maintenance requests tied to a catalog entry.
- Admin confirmation or rejection is supported for service bookings.
- A stats endpoint aggregates service booking counts and monthly cost for landlords.

#### Analytics
- Landlord analytics aggregate bookings, expenses, maintenance costs, and occupancy.
- Admin analytics provide platform-wide KPIs and performance metrics.
- KPI calculations are computed from existing model data.

#### Communications (Present but Unwired)
- Message, conversation, notification, and email template models exist.
- The app is not listed in `INSTALLED_APPS` and not routed under `urls.py`.

### 5.6 Validation and Business Rules
- Properties can only be submitted for approval when in `draft` status.
- Bookings are rejected if they overlap with pending or confirmed reservations.
- Favorites cannot be duplicated per user/property pair.
- Maintenance request creation validates property ownership for landlords.

### 5.7 Storage and Media
- PostgreSQL is the system of record.
- Amenities and photos are stored as JSON arrays in the `Property` model.
- Media files (profile photos and maintenance images) are stored under `MEDIA_ROOT`.
- Static files are collected to `staticfiles` in production.

### 5.8 Security and Environment Settings
- Password validation enforces minimum length and common password checks.
- CORS restricts allowed origins to configured domains.
- Production mode enables SSL redirect, secure cookies, and HSTS.
- A guarded `/api/create-superuser/` endpoint is available for free-tier deployments.

### 5.9 Testing
- Backend tests are present in `backend/test_*.py`.
- Recommended command: `python manage.py test`.

## 6. Frontend Architecture

### 6.1 Stack and Tooling
- React 18 with Vite.
- React Router for route management.
- TanStack Query for server state caching.
- Axios for API calls with token refresh interceptors.
- Tailwind CSS for styling.
- i18next for localization.
- Recharts for charts and KPI visuals.

### 6.2 Repository Layout (Frontend)
- `frontend/src/main.jsx` - app bootstrap and providers.
- `frontend/src/App.jsx` - route definitions and layout composition.
- `frontend/src/components/` - layout, UI primitives, dashboard widgets.
- `frontend/src/pages/` - feature pages by role.
- `frontend/src/services/` - API service modules.
- `frontend/src/contexts/` - global auth context.
- `frontend/src/hooks/` - custom hooks.
- `frontend/src/i18n/` - localization configuration and translations.

### 6.3 Bootstrapping and Providers
- `BrowserRouter` for routing.
- `QueryClientProvider` for React Query caching.
- `AuthProvider` for global authentication state.
- `Toaster` for notification UI.

### 6.4 Routing and Access Control
- Public routes: landing page, property search, property detail.
- Auth routes: login, register, forgot password.
- Landlord routes: dashboard, properties, bookings, services, expenses, onboarding.
- Tenant routes: bookings and favorites.
- Admin routes: dashboard, users, properties, bookings, service bookings, analytics.
- `ProtectedRoute` enforces authentication and role checks.

### 6.5 Auth State and API Layer
- Access and refresh tokens are stored in localStorage.
- Axios interceptors attach access tokens to requests.
- On 401 responses, the client attempts token refresh and retries.
- Failed refresh clears tokens and redirects to `/login`.

### 6.6 UI Composition and Design System
- Shared components: buttons, inputs, modals, cards, badges, alerts.
- Layout components: navbar, sidebar, container, main layout.
- Dashboard components: KPI cards, charts, analytics widgets.
- Visual style uses a green, blue-gray, and cream palette (from README).

### 6.7 Localization
- i18n initializes English, Spanish, German, French, Italian, Portuguese.
- Language selection is stored in localStorage.

### 6.8 Frontend Service Modules
- `authService` manages login, register, token refresh, logout.
- `propertyService` manages property browsing and landlord actions.
- `bookingService` manages bookings.
- `serviceService` manages maintenance service catalog and bookings.
- `userService` manages profile and user-related requests.

## 7. Data Architecture

### 7.1 Core Entities
- CustomUser: email login, role, active/verified flags.
- Profile/AdminProfile: identity and contact details by role.
- Property: listing metadata, pricing, amenities, photos, approval status.
- Booking: reservation details and status tracking.
- PropertyExpense: operating expense ledger by category.
- Favorite: tenant-saved properties with uniqueness constraint.
- MaintenanceRequest: issue tracking and service booking details.
- ServiceCatalog/ServiceProvider: predefined services and provider metadata.
- MaintenanceSchedule/MaintenanceImage: schedules and attachments.

### 7.2 Status Enumerations
- Property: `draft`, `pending_approval`, `approved`, `rejected`, `booked`.
- Booking: `pending`, `confirmed`, `cancelled`, `completed`.
- MaintenanceRequest: `open`, `assigned`, `in_progress`, `resolved`, `closed`, `cancelled`.

### 7.3 Constraints and Indexes
- Favorites unique on `(user, property)`.
- PropertyExpense indexed by `(property, expense_date)` and `(property, category)`.
- MaintenanceRequest indexed by `(rental_property, status)` and assignment fields.

## 8. Key Workflows (Detailed)

### 8.1 Property Listing and Approval
1) Landlord creates a property in `draft`.
2) Landlord submits for approval via `/api/properties/landlord/<id>/submit/`.
3) Admin reviews and approves or rejects with a reason.
4) Approved properties appear in public search and detail endpoints.

### 8.2 Booking Lifecycle
1) Tenant requests a booking with check-in/out dates and guest count.
2) API validates dates and availability.
3) Booking is created in `pending` status with calculated total price.
4) Approval depends on property `approval_type`:
   - Landlord approval: landlord updates status via `/api/bookings/<id>/status/`.
   - Admin approval: admin confirms or rejects via `/api/bookings/admin/<id>/confirm/` or `/reject/`.
5) Booking transitions to confirmed, cancelled, or completed.

### 8.3 Expense Tracking
1) Landlord creates expenses tied to their properties.
2) Expenses are categorized and aggregated in analytics dashboards.

### 8.4 Maintenance and Service Booking
1) Tenant or landlord submits a maintenance request.
2) Landlord can create service bookings from the catalog.
3) Admin confirms or rejects service bookings and can assign providers.
4) Requests progress through open, assigned, in_progress, resolved, or closed.

### 8.5 Analytics and KPIs
- Landlord dashboards compute NOI, occupancy, income, and cash flow.
- Admin dashboards compute platform-wide KPIs and asset performance.

## 9. Deployment and Environment

### 9.1 Render Services
- Backend: Python web service, Gunicorn entrypoint.
- Frontend: static site build with Vite, served from `dist`.

### 9.2 Environment Variables
Backend:
- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`.
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`.
- `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`.
- `EMAIL_*`, `DEFAULT_FROM_EMAIL`.
- `ADMIN_SECRET_KEY` (required for `/api/create-superuser/`).

Frontend:
- `VITE_API_BASE_URL` (backend base URL).

### 9.3 Build and Release
- Backend build installs Python dependencies and runs Gunicorn.
- Frontend build installs Node dependencies and builds static assets.
- SPA routing is supported via rewrite rules.

## 10. Operational Considerations
- Root API endpoint (`/`) returns API metadata and endpoint index.
- No dedicated health check endpoint is defined.
- Logging uses Django defaults; no centralized monitoring configured.
- Backups and monitoring are deployment responsibilities.

## 11. Known Gaps and Alignment Notes
- `communications` app is not registered in `INSTALLED_APPS` and has no URL routes.
- Several frontend service calls reference endpoints not implemented in the backend (reviews, payments, password reset, property images, amenities, availability, user dashboard shortcuts).
- Analytics utilities reference a `Payment` model that is not present in the backend.
- `maintenance` views reference `property__owner` and `is_admin_user`, which do not exist in current models and may need alignment.
- `create_admin_user.py` references user fields not defined in the current `CustomUser` model.
- README references `VITE_API_URL`, while frontend code uses `VITE_API_BASE_URL`.
- Celery is configured but no task modules are defined.

## 12. Appendix: Endpoint Summary (Condensed)

Auth:
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `POST /api/auth/token/refresh/`
- `GET|PUT|PATCH /api/auth/profile/`

Properties (public and landlord):
- `GET /api/properties/`
- `GET /api/properties/<id>/`
- `GET /api/properties/landlord/`
- `POST /api/properties/landlord/create/`
- `PUT|PATCH|DELETE /api/properties/landlord/<id>/`
- `POST /api/properties/landlord/<id>/submit/`
- `GET|POST /api/properties/expenses/`
- `GET /api/properties/<property_id>/expenses/`
- `GET|POST /api/properties/favorites/`
- `DELETE /api/properties/favorites/<id>/`

Properties (admin):
- `GET /api/admin/dashboard/stats/`
- `GET /api/admin/dashboard/analytics/`
- `GET /api/admin/analytics/performance/`
- `GET /api/admin/properties/pending/`
- `POST /api/admin/properties/<id>/approve/`
- `POST /api/admin/properties/<id>/reject/`
- `DELETE /api/admin/properties/<id>/delete/`
- `GET /api/admin/users/`

Bookings:
- Tenant: `GET /api/bookings/`, `POST /api/bookings/create/`, `GET /api/bookings/<id>/`, `POST /api/bookings/<id>/cancel/`
- Landlord: `GET /api/bookings/landlord/`, `GET /api/bookings/landlord/<id>/`, `POST /api/bookings/<id>/status/`
- Admin: `GET /api/bookings/admin/`, `GET /api/bookings/admin/<id>/`, `POST /api/bookings/admin/<id>/confirm/`, `POST /api/bookings/admin/<id>/reject/`

Maintenance:
- `GET|POST /api/maintenance/`
- `GET|PUT /api/maintenance/<id>/`
- `GET /api/maintenance/providers/`
- `GET|POST /api/maintenance/schedules/`
- `GET /api/maintenance/service-catalog/`
- `GET|POST /api/maintenance/service-bookings/`
- `POST /api/maintenance/service-bookings/<id>/confirm/`
- `POST /api/maintenance/service-bookings/<id>/reject/`
- `GET /api/maintenance/service-bookings/stats/`

Analytics:
- `GET /api/analytics/landlord/dashboard/`
- `GET /api/analytics/admin/dashboard/`
