"""
Simplified Booking model for Propertree.
"""
import uuid
from django.db import models
from django.conf import settings
from properties.models import Property


class Booking(models.Model):
    """
    Booking model - handles all reservations.
    Connects tenants with properties.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Foreign Keys
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        limit_choices_to={'role': 'tenant'}
    )
    
    # Booking Details
    check_in = models.DateField()
    check_out = models.DateField()
    guests_count = models.IntegerField()
    
    # Pricing
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Additional Information
    special_requests = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True, null=True, help_text="Reason provided by tenant for cancellation")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Booking #{str(self.id)[:8]} - {self.property.title}"
    
    def get_duration(self):
        """Calculate the number of nights."""
        return (self.check_out - self.check_in).days
    
    def confirm(self):
        """Confirm the booking."""
        self.status = 'confirmed'
        self.save()
    
    def cancel(self, reason=None):
        """Cancel the booking with optional reason."""
        self.status = 'cancelled'
        if reason:
            self.cancellation_reason = reason
        self.save()
    
    def complete(self):
        """Mark booking as completed."""
        self.status = 'completed'
        self.save()
    
    def calculate_total_price(self):
        """Calculate total price based on duration and property price."""
        duration = self.get_duration()
        return duration * self.property.price_per_night
