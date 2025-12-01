import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'propertree.settings')
django.setup()

from users.models import CustomUser, Profile, AdminProfile

# Fix landlord verification
landlord = CustomUser.objects.get(email='anishant303@gmail.com')
landlord.is_verified = True
landlord.save()
print(f'[OK] Verified landlord: {landlord.email}')

# Fix landlord profile
profile = Profile.objects.get(user=landlord)
profile.first_name = 'Anishant'
profile.last_name = 'Agarwal'
profile.phone_number = '+91 9876543210'
profile.save()
print(f'[OK] Updated profile: {profile.get_full_name()}')

# Create admin profile if missing
admin = CustomUser.objects.get(email='admin@propertree.com')
admin_profile, created = AdminProfile.objects.get_or_create(
    user=admin,
    defaults={
        'first_name': 'Admin',
        'last_name': 'User',
        'department': 'Platform Management'
    }
)
if created:
    print(f'[OK] Created admin profile: {admin_profile.get_full_name()}')
else:
    print(f'[OK] Admin profile exists: {admin_profile.get_full_name()}')

print('\n=== Final State ===')
print(f'Landlord: {landlord.email} - Verified: {landlord.is_verified}')
print(f'Landlord Profile: {profile.get_full_name()}')
print(f'Admin Profile: {admin_profile.get_full_name()}')

