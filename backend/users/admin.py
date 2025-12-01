"""
Admin configuration for user models.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, Profile, AdminProfile


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    """Admin interface for CustomUser model."""
    
    list_display = ('email', 'role', 'is_active', 'is_verified', 'created_at')
    list_filter = ('role', 'is_active', 'is_verified', 'created_at')
    search_fields = ('email',)
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Role & Status', {'fields': ('role', 'is_active', 'is_verified')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Admin interface for Profile model."""
    
    list_display = ('get_full_name', 'user_email', 'phone_number', 'created_at')
    search_fields = ('first_name', 'last_name', 'user__email', 'phone_number')
    list_filter = ('created_at',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Personal Information', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Profile', {'fields': ('profile_photo', 'bio', 'address')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    """Admin interface for AdminProfile model."""
    
    list_display = ('get_full_name', 'user_email', 'department', 'created_at')
    search_fields = ('first_name', 'last_name', 'user__email', 'department')
    list_filter = ('department', 'created_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Admin Information', {'fields': ('first_name', 'last_name', 'phone_number', 'department')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'
