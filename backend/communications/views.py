"""
Views for Communications app.
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Message, Notification
from .serializers import MessageSerializer, NotificationSerializer


class MessageListCreateView(generics.ListCreateAPIView):
    """API endpoint for messages."""

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return messages for current user."""
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(recipient=user)

    def perform_create(self, serializer):
        """Create message with current user as sender."""
        serializer.save(sender=self.request.user)


class MessageDetailView(generics.RetrieveAPIView):
    """API endpoint for message detail."""

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return messages user has access to."""
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(recipient=user)

    def retrieve(self, request, *args, **kwargs):
        """Mark message as read when retrieved."""
        instance = self.get_object()
        if instance.recipient == request.user:
            instance.mark_as_read()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class NotificationListView(generics.ListAPIView):
    """API endpoint for listing notifications."""

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return notifications for current user."""
        return Notification.objects.filter(user=self.request.user)


class NotificationMarkReadView(APIView):
    """API endpoint for marking notification as read."""

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """Mark notification as read."""
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            notification.mark_as_read()
            return Response({
                'message': 'Notification marked as read.'
            }, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({
                'error': 'Notification not found.'
            }, status=status.HTTP_404_NOT_FOUND)


class NotificationMarkAllReadView(APIView):
    """API endpoint for marking all notifications as read."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Mark all notifications as read."""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({
            'message': 'All notifications marked as read.'
        }, status=status.HTTP_200_OK)
