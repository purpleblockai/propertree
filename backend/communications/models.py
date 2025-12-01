"""
Communication models for Propertree platform.
"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from bookings.models import Booking

User = get_user_model()


class Message(models.Model):
    """Message model for communication between users."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')

    # Message Content
    subject = models.CharField(max_length=255, blank=True)
    message_text = models.TextField()

    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    # Parent message for threading
    parent_message = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    # Metadata
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['-sent_at']
        indexes = [
            models.Index(fields=['sender', 'recipient']),
            models.Index(fields=['booking']),
        ]

    def __str__(self):
        return f"Message from {self.sender.email} to {self.recipient.email}"

    def mark_as_read(self):
        """Mark message as read."""
        from django.utils import timezone
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])


class Conversation(models.Model):
    """Conversation model to group messages between two users."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participant1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations_as_participant1')
    participant2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations_as_participant2')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True, blank=True, related_name='conversations')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
        unique_together = ['participant1', 'participant2', 'booking']
        ordering = ['-updated_at']

    def __str__(self):
        return f"Conversation between {self.participant1.email} and {self.participant2.email}"

    def get_messages(self):
        """Get all messages in this conversation."""
        return Message.objects.filter(
            models.Q(sender=self.participant1, recipient=self.participant2) |
            models.Q(sender=self.participant2, recipient=self.participant1),
            booking=self.booking
        ).order_by('sent_at')

    @property
    def unread_count(self, user):
        """Get unread message count for a specific user."""
        return Message.objects.filter(
            conversation=self,
            recipient=user,
            is_read=False
        ).count()


class Notification(models.Model):
    """Notification model for system notifications."""

    NOTIFICATION_TYPES = [
        ('booking_request', 'Booking Request'),
        ('booking_confirmed', 'Booking Confirmed'),
        ('booking_cancelled', 'Booking Cancelled'),
        ('payment_received', 'Payment Received'),
        ('payment_failed', 'Payment Failed'),
        ('review_received', 'Review Received'),
        ('message_received', 'Message Received'),
        ('maintenance_request', 'Maintenance Request'),
        ('maintenance_resolved', 'Maintenance Resolved'),
        ('property_approved', 'Property Approved'),
        ('account_verified', 'Account Verified'),
        ('reminder', 'Reminder'),
        ('system', 'System Notification'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)

    # Content
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.URLField(blank=True)  # Link to related resource

    # Related Objects
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True, blank=True)
    # Add other foreign keys as needed

    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['notification_type']),
        ]

    def __str__(self):
        return f"{self.notification_type} for {self.user.email}"

    def mark_as_read(self):
        """Mark notification as read."""
        from django.utils import timezone
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])


class EmailTemplate(models.Model):
    """Email template model for automated emails."""

    TEMPLATE_TYPES = [
        ('welcome', 'Welcome Email'),
        ('verification', 'Email Verification'),
        ('password_reset', 'Password Reset'),
        ('booking_confirmation', 'Booking Confirmation'),
        ('booking_reminder', 'Booking Reminder'),
        ('payment_receipt', 'Payment Receipt'),
        ('review_request', 'Review Request'),
        ('maintenance_update', 'Maintenance Update'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPES, unique=True)
    subject = models.CharField(max_length=255)
    body_text = models.TextField()  # Plain text version
    body_html = models.TextField()  # HTML version

    # Template variables documentation
    variables = models.TextField(help_text="Comma-separated list of variables available in this template")

    # Status
    is_active = models.BooleanField(default=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Email Template'
        verbose_name_plural = 'Email Templates'
        ordering = ['template_type']

    def __str__(self):
        return f"{self.get_template_type_display()}"


class EmailLog(models.Model):
    """Log of sent emails."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emails_received')
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True)

    # Email Details
    subject = models.CharField(max_length=255)
    body = models.TextField()
    recipient_email = models.EmailField()

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)

    # Metadata
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Email Log'
        verbose_name_plural = 'Email Logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"Email to {self.recipient_email} - {self.status}"
