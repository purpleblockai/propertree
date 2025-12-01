"""
Simplified URL configuration for properties app.
"""
from django.urls import path
from .views import (
    PropertyListView,
    PropertyDetailView,
    LandlordPropertyListView,
    LandlordPropertyCreateView,
    LandlordPropertyUpdateView,
    PropertySubmitForApprovalView,
    PropertyExpenseListView,
    PropertyExpenseCreateView,
    PropertyExpenseDetailView,
    PropertyExpenseListByPropertyView,
    FavoriteListView,
    FavoriteDeleteView
)

app_name = 'properties'

urlpatterns = [
    # Public property views (for tenants)
    path('', PropertyListView.as_view(), name='property_list'),
    path('<uuid:pk>/', PropertyDetailView.as_view(), name='property_detail'),
    
    # Landlord property management
    path('landlord/', LandlordPropertyListView.as_view(), name='landlord_properties'),
    path('landlord/create/', LandlordPropertyCreateView.as_view(), name='landlord_create_property'),
    path('landlord/<uuid:pk>/', LandlordPropertyUpdateView.as_view(), name='landlord_update_property'),
    path('landlord/<uuid:pk>/submit/', PropertySubmitForApprovalView.as_view(), name='submit_for_approval'),
    
    # Property expenses management
    path('expenses/', PropertyExpenseListView.as_view(), name='expense_list'),
    path('expenses/create/', PropertyExpenseCreateView.as_view(), name='expense_create'),
    path('expenses/<uuid:pk>/', PropertyExpenseDetailView.as_view(), name='expense_detail'),
    path('<uuid:property_id>/expenses/', PropertyExpenseListByPropertyView.as_view(), name='property_expenses'),
    
    # Favorites management
    path('favorites/', FavoriteListView.as_view(), name='favorite_list'),
    path('favorites/<uuid:pk>/', FavoriteDeleteView.as_view(), name='favorite_delete'),
]
