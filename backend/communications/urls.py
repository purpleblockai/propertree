"""
URL configuration for Communications app.
"""
from django.urls import path
from .views import (
    MessageListCreateView,
    MessageDetailView,
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkAllReadView
)

urlpatterns = [
    # Messages
    path('', MessageListCreateView.as_view(), name='message_list_create'),
    path('<uuid:pk>/', MessageDetailView.as_view(), name='message_detail'),

    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notification_list'),
    path('notifications/<uuid:pk>/read/', NotificationMarkReadView.as_view(), name='notification_mark_read'),
    path('notifications/read-all/', NotificationMarkAllReadView.as_view(), name='notification_mark_all_read'),
]
