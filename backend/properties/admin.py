"""
Admin configuration for property models.
"""
from django.contrib import admin
from .models import Property, Favorite


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """Admin interface for Property model."""
    
    list_display = ('title', 'city', 'property_type', 'status', 'price_per_night', 'landlord_email', 'created_at')
    list_filter = ('status', 'property_type', 'city', 'created_at')
    search_fields = ('title', 'city', 'address', 'landlord__email')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('landlord', 'title', 'description', 'property_type')
        }),
        ('Location', {
            'fields': ('address', 'city', 'state', 'country', 'postal_code')
        }),
        ('Property Details', {
            'fields': ('bedrooms', 'bathrooms', 'max_guests', 'price_per_night')
        }),
        ('Features', {
            'fields': ('amenities', 'photos')
        }),
        ('Status Management', {
            'fields': ('status', 'rejection_reason', 'approved_by', 'approved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'approved_at')
    
    def landlord_email(self, obj):
        return obj.landlord.email
    landlord_email.short_description = 'Landlord'
    
    actions = ['approve_properties', 'reject_properties']
    
    def approve_properties(self, request, queryset):
        """Bulk approve properties."""
        for property in queryset:
            property.approve(request.user)
        self.message_user(request, f"{queryset.count()} properties approved.")
    approve_properties.short_description = "Approve selected properties"
    
    def reject_properties(self, request, queryset):
        """Bulk reject properties."""
        for property in queryset:
            property.reject("Rejected by admin")
        self.message_user(request, f"{queryset.count()} properties rejected.")
    reject_properties.short_description = "Reject selected properties"


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    """Admin interface for Favorite model."""
    
    list_display = ('user_email', 'property_title', 'property_city', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'property__title', 'property__city')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    
    def property_title(self, obj):
        return obj.property.title
    property_title.short_description = 'Property'
    
    def property_city(self, obj):
        return obj.property.city
    property_city.short_description = 'City'
