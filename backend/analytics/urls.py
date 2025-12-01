"""
URL configuration for Analytics app.
"""
from django.urls import path
from .views import LandlordDashboardView, AdminDashboardView

urlpatterns = [
    path('landlord/dashboard/', LandlordDashboardView.as_view(), name='landlord_dashboard'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
]
