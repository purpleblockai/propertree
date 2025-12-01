"""
Serializers for Maintenance app.
"""
from rest_framework import serializers
from .models import MaintenanceRequest, MaintenanceImage, ServiceProvider, MaintenanceSchedule, ServiceCatalog
from properties.serializers import PropertyListSerializer
from users.serializers import UserSerializer


class ServiceCatalogSerializer(serializers.ModelSerializer):
    """Serializer for service catalog."""

    formatted_price = serializers.ReadOnlyField()

    class Meta:
        model = ServiceCatalog
        fields = '__all__'


class ServiceProviderSerializer(serializers.ModelSerializer):
    """Serializer for service providers."""

    class Meta:
        model = ServiceProvider
        fields = '__all__'


class MaintenanceImageSerializer(serializers.ModelSerializer):
    """Serializer for maintenance images."""

    class Meta:
        model = MaintenanceImage
        fields = ['id', 'image', 'caption', 'created_at']


class MaintenanceRequestSerializer(serializers.ModelSerializer):
    """Serializer for maintenance requests."""

    images = MaintenanceImageSerializer(many=True, read_only=True)
    assigned_to = ServiceProviderSerializer(read_only=True)
    service_catalog = ServiceCatalogSerializer(read_only=True)
    rental_property = PropertyListSerializer(read_only=True)
    reported_by = UserSerializer(read_only=True)
    admin_confirmed_by_email = serializers.EmailField(source='admin_confirmed_by.email', read_only=True)
    resolution_time = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()

    # For write operations
    service_catalog_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    assigned_to_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = MaintenanceRequest
        fields = '__all__'
        read_only_fields = [
            'id', 'reported_by', 'reported_at', 'updated_at',
            'assigned_at', 'resolved_at', 'admin_confirmed_by', 'admin_confirmed_at'
        ]

    def create(self, validated_data):
        """Handle foreign key IDs during creation."""
        service_catalog_id = validated_data.pop('service_catalog_id', None)
        assigned_to_id = validated_data.pop('assigned_to_id', None)

        # Create the maintenance request
        maintenance_request = MaintenanceRequest.objects.create(**validated_data)

        # Set foreign keys if provided
        if service_catalog_id:
            maintenance_request.service_catalog_id = service_catalog_id
        if assigned_to_id:
            maintenance_request.assigned_to_id = assigned_to_id

        maintenance_request.save()
        return maintenance_request

    def update(self, instance, validated_data):
        """Handle foreign key IDs during update."""
        service_catalog_id = validated_data.pop('service_catalog_id', None)
        assigned_to_id = validated_data.pop('assigned_to_id', None)

        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update foreign keys if provided
        if service_catalog_id is not None:
            instance.service_catalog_id = service_catalog_id
        if assigned_to_id is not None:
            instance.assigned_to_id = assigned_to_id

        instance.save()
        return instance


class MaintenanceScheduleSerializer(serializers.ModelSerializer):
    """Serializer for maintenance schedules."""

    class Meta:
        model = MaintenanceSchedule
        fields = '__all__'
