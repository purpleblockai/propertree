"""
Admin configuration for Maintenance app.
"""
from django.contrib import admin
from .models import ServiceProvider, MaintenanceRequest, MaintenanceImage, MaintenanceSchedule, ServiceCatalog


@admin.register(ServiceCatalog)
class ServiceCatalogAdmin(admin.ModelAdmin):
    """Admin interface for ServiceCatalog model."""

    list_display = ('name', 'category', 'formatted_price', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'category')
    readonly_fields = ('formatted_price', 'created_at', 'updated_at')

    fieldsets = (
        ('Service Information', {
            'fields': ('name', 'category', 'description', 'icon')
        }),
        ('Pricing', {
            'fields': ('price', 'estimated_duration_minutes'),
            'description': 'Price must be under EUR 100'
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):
    """Admin interface for ServiceProvider model."""

    list_display = ('name', 'service_type', 'rating', 'total_jobs', 'is_active', 'is_verified', 'created_at')
    list_filter = ('service_type', 'is_active', 'is_verified', 'created_at')
    search_fields = ('name', 'email', 'phone', 'company_name')
    readonly_fields = ('rating', 'total_jobs', 'created_at', 'updated_at')


class MaintenanceImageInline(admin.TabularInline):
    """Inline admin for maintenance images."""

    model = MaintenanceImage
    extra = 1


@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    """Admin interface for MaintenanceRequest model."""

    list_display = ('title', 'rental_property', 'reported_by', 'category', 'priority', 'status', 'assigned_to', 'reported_at')
    list_filter = ('status', 'priority', 'category', 'reported_at')
    search_fields = ('title', 'description', 'rental_property__title', 'reported_by__email')
    inlines = [MaintenanceImageInline]
    readonly_fields = ('reported_at', 'updated_at', 'assigned_at', 'resolved_at')

    fieldsets = (
        ('Request Information', {
            'fields': ('rental_property', 'reported_by', 'title', 'description', 'category', 'priority', 'status')
        }),
        ('Service Booking', {
            'fields': (
                'service_catalog', 'booking_type', 'requested_date', 'requested_time',
                'admin_confirmed_by', 'admin_confirmed_at', 'admin_rejection_reason'
            ),
            'classes': ('collapse',),
            'description': 'Fields specific to landlord service bookings'
        }),
        ('Assignment', {
            'fields': ('assigned_to', 'assigned_at')
        }),
        ('Resolution', {
            'fields': ('resolved_at', 'resolution_notes', 'cost', 'rating', 'rating_notes')
        }),
        ('Metadata', {
            'fields': ('reported_at', 'updated_at')
        }),
    )


@admin.register(MaintenanceImage)
class MaintenanceImageAdmin(admin.ModelAdmin):
    """Admin interface for MaintenanceImage model."""

    list_display = ('maintenance_request', 'caption', 'created_at')
    search_fields = ('maintenance_request__title', 'caption')


@admin.register(MaintenanceSchedule)
class MaintenanceScheduleAdmin(admin.ModelAdmin):
    """Admin interface for MaintenanceSchedule model."""

    list_display = ('title', 'rental_property', 'frequency', 'next_due_date', 'last_completed', 'is_active', 'created_at')
    list_filter = ('frequency', 'is_active', 'next_due_date')
    search_fields = ('title', 'description', 'rental_property__title')
    readonly_fields = ('created_at', 'updated_at')
