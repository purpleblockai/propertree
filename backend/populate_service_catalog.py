"""
Script to populate the Service Catalog with sample services.
Run this script after migrating the database:
python manage.py shell < populate_service_catalog.py
OR
python populate_service_catalog.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'propertree.settings')
django.setup()

from maintenance.models import ServiceCatalog

# Sample service catalog data - all prices under $100
SERVICES = [
    # Plumbing Services
    {
        'name': 'Leak Repair',
        'category': 'plumbing',
        'description': 'Professional leak detection and repair for pipes, faucets, and fixtures',
        'price': 75,
        'estimated_duration_minutes': 120,
        'icon': 'droplets',
    },
    {
        'name': 'Drain Cleaning',
        'category': 'plumbing',
        'description': 'Clear clogged drains and sewers using professional equipment',
        'price': 60,
        'estimated_duration_minutes': 90,
        'icon': 'droplets',
    },
    {
        'name': 'Faucet Repair',
        'category': 'plumbing',
        'description': 'Repair or replace faucets and fixtures',
        'price': 50,
        'estimated_duration_minutes': 60,
        'icon': 'droplets',
    },

    # Electrical Services
    {
        'name': 'Outlet Installation',
        'category': 'electrical',
        'description': 'Install new electrical outlets or replace existing ones',
        'price': 65,
        'estimated_duration_minutes': 60,
        'icon': 'zap',
    },
    {
        'name': 'Light Fixture Installation',
        'category': 'electrical',
        'description': 'Install ceiling lights, chandeliers, and other fixtures',
        'price': 70,
        'estimated_duration_minutes': 90,
        'icon': 'zap',
    },
    {
        'name': 'Circuit Breaker Repair',
        'category': 'electrical',
        'description': 'Repair or replace circuit breakers',
        'price': 80,
        'estimated_duration_minutes': 60,
        'icon': 'zap',
    },

    # HVAC Services
    {
        'name': 'AC Maintenance',
        'category': 'hvac',
        'description': 'Annual air conditioning system maintenance and tune-up',
        'price': 85,
        'estimated_duration_minutes': 90,
        'icon': 'wind',
    },
    {
        'name': 'Furnace Repair',
        'category': 'hvac',
        'description': 'Diagnose and repair heating system issues',
        'price': 90,
        'estimated_duration_minutes': 120,
        'icon': 'wind',
    },
    {
        'name': 'Filter Replacement',
        'category': 'hvac',
        'description': 'Replace HVAC air filters',
        'price': 40,
        'estimated_duration_minutes': 30,
        'icon': 'wind',
    },

    # Cleaning Services
    {
        'name': 'Deep Cleaning',
        'category': 'cleaning',
        'description': 'Thorough deep cleaning of entire property including hard-to-reach areas',
        'price': 95,
        'estimated_duration_minutes': 240,
        'icon': 'sparkles',
    },
    {
        'name': 'Move-Out Cleaning',
        'category': 'cleaning',
        'description': 'Complete cleaning after tenant move-out to prepare for new tenants',
        'price': 90,
        'estimated_duration_minutes': 300,
        'icon': 'sparkles',
    },
    {
        'name': 'Carpet Cleaning',
        'category': 'cleaning',
        'description': 'Professional carpet shampooing and stain removal',
        'price': 70,
        'estimated_duration_minutes': 120,
        'icon': 'sparkles',
    },

    # Painting Services
    {
        'name': 'Touch-Up Painting',
        'category': 'painting',
        'description': 'Small area touch-up painting and patch work',
        'price': 55,
        'estimated_duration_minutes': 120,
        'icon': 'paintbrush',
    },
    {
        'name': 'Room Painting',
        'category': 'painting',
        'description': 'Paint a single room including walls and trim',
        'price': 85,
        'estimated_duration_minutes': 240,
        'icon': 'paintbrush',
    },

    # Carpentry Services
    {
        'name': 'Door Repair',
        'category': 'carpentry',
        'description': 'Repair or adjust interior and exterior doors',
        'price': 60,
        'estimated_duration_minutes': 90,
        'icon': 'wrench',
    },
    {
        'name': 'Cabinet Repair',
        'category': 'carpentry',
        'description': 'Repair kitchen or bathroom cabinets',
        'price': 75,
        'estimated_duration_minutes': 120,
        'icon': 'wrench',
    },

    # Locksmith Services
    {
        'name': 'Lock Replacement',
        'category': 'locksmith',
        'description': 'Replace door locks and provide new keys',
        'price': 65,
        'estimated_duration_minutes': 60,
        'icon': 'lock',
    },
    {
        'name': 'Rekey Service',
        'category': 'locksmith',
        'description': 'Rekey existing locks for new tenants',
        'price': 45,
        'estimated_duration_minutes': 45,
        'icon': 'lock',
    },

    # Gardening Services
    {
        'name': 'Lawn Maintenance',
        'category': 'gardening',
        'description': 'Regular lawn mowing, trimming, and edging',
        'price': 50,
        'estimated_duration_minutes': 90,
        'icon': 'leaf',
    },
    {
        'name': 'Garden Cleanup',
        'category': 'gardening',
        'description': 'Clean up garden beds and remove debris',
        'price': 55,
        'estimated_duration_minutes': 120,
        'icon': 'leaf',
    },

    # Pest Control
    {
        'name': 'General Pest Control',
        'category': 'pest_control',
        'description': 'Comprehensive pest control treatment for common pests',
        'price': 80,
        'estimated_duration_minutes': 90,
        'icon': 'bug',
    },
    {
        'name': 'Pest Inspection',
        'category': 'pest_control',
        'description': 'Professional pest inspection and assessment',
        'price': 60,
        'estimated_duration_minutes': 60,
        'icon': 'bug',
    },

    # Appliance Repair
    {
        'name': 'Refrigerator Repair',
        'category': 'appliance',
        'description': 'Diagnose and repair refrigerator issues',
        'price': 75,
        'estimated_duration_minutes': 120,
        'icon': 'settings',
    },
    {
        'name': 'Washer/Dryer Repair',
        'category': 'appliance',
        'description': 'Repair washing machines and dryers',
        'price': 70,
        'estimated_duration_minutes': 90,
        'icon': 'settings',
    },
]

def populate_services():
    """Populate the service catalog with sample data."""
    print("Populating Service Catalog...")

    created_count = 0
    updated_count = 0

    for service_data in SERVICES:
        service, created = ServiceCatalog.objects.update_or_create(
            name=service_data['name'],
            category=service_data['category'],
            defaults={
                'description': service_data['description'],
                'price': service_data.get('price'),
                'estimated_duration_minutes': service_data.get('estimated_duration_minutes'),
                'icon': service_data.get('icon', 'wrench'),
                'is_active': True,
            }
        )

        if created:
            created_count += 1
            print(f"  ✓ Created: {service.name} - ${service.price}")
        else:
            updated_count += 1
            print(f"  ↻ Updated: {service.name} - ${service.price}")

    print(f"\n✅ Done! Created {created_count} services, updated {updated_count} services.")
    print(f"📊 Total services in catalog: {ServiceCatalog.objects.count()}")

if __name__ == '__main__':
    populate_services()
