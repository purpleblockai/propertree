# Generated migration to add price field and migrate data from estimated_price_min/max

from django.db import migrations, models
import django.core.validators


def migrate_price_data(apps, schema_editor):
    """Migrate data from estimated_price_min/max to price field."""
    ServiceCatalog = apps.get_model('maintenance', 'ServiceCatalog')
    
    for service in ServiceCatalog.objects.all():
        # Use min price if available, otherwise use max, otherwise set to None
        if service.estimated_price_min:
            # Ensure it's under 100
            price = min(float(service.estimated_price_min), 99.99)
            service.price = price
        elif service.estimated_price_max:
            # Ensure it's under 100
            price = min(float(service.estimated_price_max), 99.99)
            service.price = price
        else:
            service.price = None
        service.save()


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0002_servicecatalog_maintenancerequest_admin_confirmed_at_and_more'),
    ]

    operations = [
        # Add new price field
        migrations.AddField(
            model_name='servicecatalog',
            name='price',
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text='Service price (must be under $100)',
                max_digits=10,
                null=True,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(100)
                ]
            ),
        ),
        # Migrate data
        migrations.RunPython(migrate_price_data, migrations.RunPython.noop),
        # Remove old fields (optional - comment out if you want to keep them for now)
        # migrations.RemoveField(
        #     model_name='servicecatalog',
        #     name='estimated_price_min',
        # ),
        # migrations.RemoveField(
        #     model_name='servicecatalog',
        #     name='estimated_price_max',
        # ),
    ]


