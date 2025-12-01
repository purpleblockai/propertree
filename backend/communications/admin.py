"""
Admin configuration for Communications app.
"""
from django.contrib import admin
from .models import Message, Conversation, Notification, EmailTemplate, EmailLog


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """Admin interface for Message model."""

    list_display = ('sender', 'recipient', 'subject', 'is_read', 'sent_at')
    list_filter = ('is_read', 'sent_at')
    search_fields = ('sender__email', 'recipient__email', 'subject', 'message_text')
    readonly_fields = ('sent_at', 'read_at')


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    """Admin interface for Conversation model."""

    list_display = ('participant1', 'participant2', 'booking', 'created_at', 'updated_at')
    search_fields = ('participant1__email', 'participant2__email')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin interface for Notification model."""

    list_display = ('user', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__email', 'title', 'message')
    readonly_fields = ('created_at', 'read_at')


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    """Admin interface for EmailTemplate model."""

    list_display = ('template_type', 'subject', 'is_active', 'created_at')
    list_filter = ('template_type', 'is_active')
    search_fields = ('subject', 'body_text', 'variables')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    """Admin interface for EmailLog model."""

    list_display = ('recipient_email', 'subject', 'status', 'sent_at', 'created_at')
    list_filter = ('status', 'sent_at', 'created_at')
    search_fields = ('recipient_email', 'subject', 'body')
    readonly_fields = ('sent_at', 'created_at')
