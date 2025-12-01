import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'propertree.settings')
django.setup()

from properties.models import Property
from users.models import CustomUser, Profile

print('=== PROPERTIES ===')
for p in Property.objects.all():
    print(f'ID: {p.id}')
    print(f'Title: {p.title}')
    print(f'Status: {p.status}')
    print(f'Owner: {p.landlord.email}')
    print('---')

print('\n=== USERS ===')
for u in CustomUser.objects.all():
    print(f'Email: {u.email}')
    print(f'Role: {u.role}')
    print(f'Verified: {u.is_verified}')
    print('---')

print('\n=== PROFILES ===')
print(f'Total profiles: {Profile.objects.count()}')
for prof in Profile.objects.all():
    print(f'User: {prof.user.email}')
    print(f'Name: {prof.get_full_name()}')
    print('---')




