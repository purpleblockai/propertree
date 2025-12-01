"""
Script to create an admin user for testing
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'propertree.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Admin user credentials
ADMIN_EMAIL = 'admin@propertree.com'
ADMIN_PASSWORD = 'admin123'
ADMIN_FIRST_NAME = 'Admin'
ADMIN_LAST_NAME = 'User'

# Check if admin user already exists
if User.objects.filter(email=ADMIN_EMAIL).exists():
    print(f"Admin user {ADMIN_EMAIL} already exists")
    admin = User.objects.get(email=ADMIN_EMAIL)

    # Update role to admin if it's not
    if admin.role != 'admin':
        admin.role = 'admin'
        admin.save()
        print(f"Updated user role to 'admin'")

    # Update password in case it changed
    admin.set_password(ADMIN_PASSWORD)
    admin.save()
    print(f"Password updated for {ADMIN_EMAIL}")
else:
    # Create new admin user
    admin = User.objects.create_user(
        email=ADMIN_EMAIL,
        password=ADMIN_PASSWORD,
        first_name=ADMIN_FIRST_NAME,
        last_name=ADMIN_LAST_NAME,
        role='admin',
        is_email_verified=True
    )
    print(f"Created admin user: {ADMIN_EMAIL}")

print("\n" + "=" * 50)
print("ADMIN USER CREDENTIALS")
print("=" * 50)
print(f"Email: {ADMIN_EMAIL}")
print(f"Password: {ADMIN_PASSWORD}")
print(f"Role: {admin.role}")
print("=" * 50)
