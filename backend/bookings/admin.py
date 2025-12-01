"""
Admin configuration for booking models.
"""
from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Admin interface for Booking model."""
    
    list_display = ('booking_id', 'property_title', 'tenant_email', 'check_in', 'check_out', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'check_in', 'check_out', 'created_at')
    search_fields = ('property__title', 'tenant__email', 'special_requests', 'cancellation_reason')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('property', 'tenant', 'check_in', 'check_out', 'guests_count')
        }),
        ('Pricing & Status', {
            'fields': ('total_price', 'status')
        }),
        ('Additional Information', {
            'fields': ('special_requests', 'cancellation_reason')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def booking_id(self, obj):
        return f"#{str(obj.id)[:8]}"
    booking_id.short_description = 'ID'
    
    def property_title(self, obj):
        return obj.property.title
    property_title.short_description = 'Property'
    
    def tenant_email(self, obj):
        return obj.tenant.email
    tenant_email.short_description = 'Tenant'
    
    actions = ['confirm_bookings', 'cancel_bookings']
    
    def confirm_bookings(self, request, queryset):
        """Bulk confirm bookings."""
        for booking in queryset:
            booking.confirm()
        self.message_user(request, f"{queryset.count()} bookings confirmed.")
    confirm_bookings.short_description = "Confirm selected bookings"
    
    def cancel_bookings(self, request, queryset):
        """Bulk cancel bookings."""
        for booking in queryset:
            booking.cancel()
        self.message_user(request, f"{queryset.count()} bookings cancelled.")
    cancel_bookings.short_description = "Cancel selected bookings"
