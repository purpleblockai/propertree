"""
URL configuration for Propertree project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/properties/', include('properties.urls')),
    path('api/admin/', include('properties.admin_urls')),  # Admin portal endpoints
    path('api/bookings/', include('bookings.urls')),
    path('api/maintenance/', include('maintenance.urls')),  # Maintenance & service bookings
    path('api/analytics/', include('analytics.urls')),  # Analytics endpoints
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
