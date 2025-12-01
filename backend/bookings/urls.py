"""
Simplified URL configuration for bookings app.
"""
from django.urls import path
from .views import (
    TenantBookingListView,
    TenantBookingDetailView,
    TenantBookingCreateView,
    TenantBookingCancelView,
    LandlordBookingListView,
    LandlordBookingDetailView,
    LandlordBookingConfirmView,
    LandlordBookingRejectView,
    BookingStatusUpdateView,
    AdminBookingListView,
    AdminBookingDetailView,
    AdminBookingConfirmView,
    AdminBookingRejectView
)

app_name = 'bookings'

urlpatterns = [
    # Combined tenant endpoints (for frontend convenience)
    path('', TenantBookingListView.as_view(), name='bookings_list'),  # GET /api/bookings/
    path('create/', TenantBookingCreateView.as_view(), name='create_booking'),  # POST /api/bookings/create/
    path('<uuid:pk>/', TenantBookingDetailView.as_view(), name='booking_detail'),
    path('<uuid:pk>/cancel/', TenantBookingCancelView.as_view(), name='cancel_booking'),
    path('<uuid:pk>/status/', BookingStatusUpdateView.as_view(), name='update_booking_status'),  # Unified status update

    # Landlord booking endpoints
    path('landlord/', LandlordBookingListView.as_view(), name='landlord_bookings'),
    path('landlord/<uuid:pk>/', LandlordBookingDetailView.as_view(), name='landlord_booking_detail'),

    # Admin booking endpoints
    path('admin/', AdminBookingListView.as_view(), name='admin_bookings'),
    path('admin/<uuid:pk>/', AdminBookingDetailView.as_view(), name='admin_booking_detail'),
    path('admin/<uuid:pk>/confirm/', AdminBookingConfirmView.as_view(), name='admin_confirm_booking'),
    path('admin/<uuid:pk>/reject/', AdminBookingRejectView.as_view(), name='admin_reject_booking'),
]
