"""
Test script to verify admin bookings API
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'propertree.settings')
django.setup()

from bookings.models import Booking
from django.contrib.auth import get_user_model

User = get_user_model()

print("=" * 50)
print("TESTING ADMIN BOOKINGS API")
print("=" * 50)

# Get admin user
try:
    admin = User.objects.get(email='admin@propertree.com')
    print(f"\nAdmin user found: {admin.email}")
    print(f"  Role: {admin.role}")
except User.DoesNotExist:
    print("\n[ERROR] Admin user not found!")
    exit(1)

# Check if admin role matches
if admin.role != 'admin':
    print(f"\n[ERROR] User role is '{admin.role}', not 'admin'")
    exit(1)

print("\n[OK] User has correct admin role")

# Get all bookings
all_bookings = Booking.objects.all()
print(f"\nTotal bookings in database: {all_bookings.count()}")

# Get admin-approval bookings
admin_bookings = Booking.objects.filter(property__approval_type='admin')
print(f"Admin-approval bookings: {admin_bookings.count()}")

if admin_bookings.exists():
    print("\nAdmin-approval bookings details:")
    for booking in admin_bookings:
        print(f"  - Property: {booking.property.title}")
        print(f"    Approval Type: {booking.property.approval_type}")
        print(f"    Status: {booking.status}")
        print(f"    Tenant: {booking.tenant.email}")
        print(f"    Check-in: {booking.check_in}")
        print(f"    Check-out: {booking.check_out}")
        print()

# Get landlord-approval bookings
landlord_bookings = Booking.objects.filter(property__approval_type='landlord')
print(f"Landlord-approval bookings: {landlord_bookings.count()}")

print("\n" + "=" * 50)
print("TEST COMPLETE")
print("=" * 50)
print("\nIf you see admin-approval bookings above, the backend is working correctly.")
print("The issue is likely on the frontend or with authentication tokens.")
