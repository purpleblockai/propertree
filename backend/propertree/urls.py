"""
URL configuration for Propertree project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from .migration_runner import run_migrations, collect_static

def api_root(request):
    """Root endpoint with API information"""
    return JsonResponse({
        'message': 'Propertree API',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'auth': '/api/auth/',
            'properties': '/api/properties/',
            'bookings': '/api/bookings/',
            'maintenance': '/api/maintenance/',
            'analytics': '/api/analytics/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/properties/', include('properties.urls')),
    path('api/admin/', include('properties.admin_urls')),  # Admin portal endpoints
    path('api/bookings/', include('bookings.urls')),
    path('api/maintenance/', include('maintenance.urls')),  # Maintenance & service bookings
    path('api/analytics/', include('analytics.urls')),  # Analytics endpoints
    # Temporary migration endpoints (remove after initial setup)
    path('api/migrate/', run_migrations, name='run-migrations'),
    path('api/collectstatic/', collect_static, name='collect-static'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
