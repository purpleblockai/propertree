"""
Serializers for Communications app.
"""
from rest_framework import serializers
from .models import Message, Notification


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for messages."""

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['id', 'sender', 'sent_at', 'is_read', 'read_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications."""

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'is_read', 'read_at']
