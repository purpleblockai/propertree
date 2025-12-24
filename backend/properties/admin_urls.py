"""
URL configuration for admin-specific property endpoints.
"""
from django.urls import path
from .admin_views import (
    AdminDashboardStatsView,
    PendingPropertiesView,
    ApprovePropertyView,
    RejectPropertyView,
    AllPropertiesAdminView,
    PropertyFilterOptionsView,
    AdminUsersListView,
    PropertyAnalyticsView,
    AssetPerformanceView
    ,AdminDeletePropertyView
)

urlpatterns = [
    # Dashboard stats
    path('dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin_dashboard_stats'),
    path('dashboard/analytics/', PropertyAnalyticsView.as_view(), name='admin_analytics'),
    path('analytics/performance/', AssetPerformanceView.as_view(), name='admin_asset_performance'),
    
    # Property management
    path('properties/pending/', PendingPropertiesView.as_view(), name='pending_properties'),
    path('properties/all/', AllPropertiesAdminView.as_view(), name='all_properties_admin'),
    path('properties/filter-options/', PropertyFilterOptionsView.as_view(), name='property_filter_options'),
    path('properties/<uuid:pk>/approve/', ApprovePropertyView.as_view(), name='approve_property'),
    path('properties/<uuid:pk>/reject/', RejectPropertyView.as_view(), name='reject_property'),
        path('properties/<uuid:pk>/delete/', AdminDeletePropertyView.as_view(), name='delete_property'),
    
    # User management
    path('users/', AdminUsersListView.as_view(), name='admin_users_list'),
]



