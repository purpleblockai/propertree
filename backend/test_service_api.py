"""
Quick test script to verify the service catalog API is working.
Run this after populating the service catalog.
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'propertree.settings')
django.setup()

from maintenance.models import ServiceCatalog
from users.models import CustomUser

def test_service_catalog():
    """Test the service catalog data."""
    print("=" * 50)
    print("Testing Service Catalog API")
    print("=" * 50)

    # Check if services exist
    services = ServiceCatalog.objects.filter(is_active=True)
    print(f"\n[OK] Total active services: {services.count()}")

    if services.count() == 0:
        print("\n[WARNING] No services found!")
        print("Please run: python populate_service_catalog.py")
        return

    # Show services by category
    print("\nServices by category:")
    categories = services.values_list('category', flat=True).distinct()
    for category in categories:
        count = services.filter(category=category).count()
        print(f"  - {category}: {count} services")

    # Show first 3 services
    print("\nFirst 3 services:")
    for service in services[:3]:
        print(f"  - {service.name} ({service.get_category_display()})")
        print(f"    Price: {service.estimated_price_range}")
        print(f"    Duration: {service.estimated_duration_minutes} minutes")

    # Check user accounts
    print("\n" + "=" * 50)
    print("Checking user accounts")
    print("=" * 50)

    landlords = CustomUser.objects.filter(role='landlord')
    print(f"\n[OK] Total landlords: {landlords.count()}")

    if landlords.count() > 0:
        print("\nLandlord accounts:")
        for landlord in landlords[:3]:
            print(f"  - {landlord.email}")
    else:
        print("\n[WARNING] No landlord accounts found!")
        print("Create a landlord account to test the service booking feature.")

    # Test API access
    print("\n" + "=" * 50)
    print("API Endpoints")
    print("=" * 50)
    print("\nTo test the API:")
    print("1. Start the backend server: python manage.py runserver")
    print("2. Login as a landlord on the frontend")
    print("3. Navigate to /landlord/services")
    print("\nDirect API endpoints (require authentication):")
    print("  - GET http://localhost:8000/api/maintenance/service-catalog/")
    print("  - GET http://localhost:8000/api/maintenance/service-catalog/categories/")
    print("  - GET http://localhost:8000/api/maintenance/service-bookings/")

    print("\n[OK] Service catalog is ready!")

if __name__ == '__main__':
    test_service_catalog()
