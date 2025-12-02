"""
Simplified views for Bookings app.
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Booking
from .serializers import (
    BookingListSerializer,
    BookingDetailSerializer,
    BookingCreateSerializer
)


class TenantBookingListView(generics.ListAPIView):
    """
    API endpoint for tenants to view their bookings.
    """
    
    serializer_class = BookingListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return bookings made by the current tenant."""
        return Booking.objects.filter(tenant=self.request.user).order_by('-created_at')


class TenantBookingDetailView(generics.RetrieveAPIView):
    """
    API endpoint for tenants to view a specific booking.
    """
    
    serializer_class = BookingDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return bookings made by the current tenant."""
        return Booking.objects.filter(tenant=self.request.user)


class TenantBookingCreateView(generics.CreateAPIView):
    """
    API endpoint for tenants to create new bookings.
    """
    
    serializer_class = BookingCreateSerializer
    permission_classes = [IsAuthenticated]


class TenantBookingCancelView(APIView):
    """
    API endpoint for tenants to cancel their bookings.
    """
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        """Cancel a booking with reason."""
        try:
            booking = Booking.objects.get(pk=pk, tenant=request.user)
            
            if booking.status in ['cancelled', 'completed']:
                return Response(
                    {'error': 'Cannot cancel this booking'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cancellation_reason = request.data.get('cancellation_reason', '').strip()
            if not cancellation_reason:
                return Response(
                    {'error': 'Cancellation reason is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booking.cancel(reason=cancellation_reason)
            
            return Response({
                'message': 'Booking cancelled successfully',
                'booking': BookingDetailSerializer(booking).data
            }, status=status.HTTP_200_OK)
            
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class LandlordBookingListView(generics.ListAPIView):
    """
    API endpoint for landlords to view bookings for their properties.
    Shows all bookings for properties owned by the landlord, regardless of approval type.
    """

    serializer_class = BookingListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return bookings for all properties owned by the current landlord."""
        return Booking.objects.filter(
            property__landlord=self.request.user
        ).order_by('-created_at')


class LandlordBookingDetailView(generics.RetrieveAPIView):
    """
    API endpoint for landlords to view booking details for their properties.
    Shows all bookings for properties owned by the landlord, regardless of approval type.
    """

    serializer_class = BookingDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return bookings for all properties owned by the current landlord."""
        return Booking.objects.filter(
            property__landlord=self.request.user
        )


class LandlordBookingConfirmView(APIView):
    """
    API endpoint for landlords to confirm bookings for properties with landlord approval type.
    Landlords can only confirm bookings for properties with landlord approval type.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """Confirm a booking."""
        try:
            booking = Booking.objects.get(
                pk=pk,
                property__landlord=request.user
            )
            
            # Check if landlord can confirm this booking (only for landlord approval type)
            if booking.property.approval_type != 'landlord':
                return Response(
                    {'error': 'Only bookings for properties with landlord approval can be confirmed by landlords'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if booking.status != 'pending':
                return Response(
                    {'error': 'Only pending bookings can be confirmed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booking.confirm()
            
            return Response({
                'message': 'Booking confirmed successfully',
                'booking': BookingDetailSerializer(booking).data
            }, status=status.HTTP_200_OK)
            
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class LandlordBookingRejectView(APIView):
    """
    API endpoint for landlords to reject/cancel bookings for properties with landlord approval type.
    Landlords can only reject bookings for properties with landlord approval type.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """Reject a booking."""
        try:
            booking = Booking.objects.get(
                pk=pk,
                property__landlord=request.user
            )
            
            # Check if landlord can reject this booking (only for landlord approval type)
            if booking.property.approval_type != 'landlord':
                return Response(
                    {'error': 'Only bookings for properties with landlord approval can be rejected by landlords'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if booking.status in ['cancelled', 'completed']:
                return Response(
                    {'error': 'Cannot reject this booking'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booking.cancel()
            
            return Response({
                'message': 'Booking rejected',
                'booking': BookingDetailSerializer(booking).data
            }, status=status.HTTP_200_OK)
            
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class BookingStatusUpdateView(APIView):
    """
    Unified API endpoint for updating booking status.
    Used by landlords to confirm/cancel bookings for properties with landlord approval type.
    Landlords can view all bookings but can only update bookings for properties with landlord approval type.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """Update booking status."""
        try:
            booking = Booking.objects.get(
                pk=pk,
                property__landlord=request.user
            )
            
            # Check if landlord can update this booking (only for landlord approval type)
            if booking.property.approval_type != 'landlord':
                return Response(
                    {'error': 'Only bookings for properties with landlord approval can be updated by landlords'},
                    status=status.HTTP_403_FORBIDDEN
                )
            new_status = request.data.get('status')

            if not new_status:
                return Response(
                    {'error': 'Status is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate status
            valid_statuses = ['pending', 'confirmed', 'cancelled', 'completed']
            if new_status not in valid_statuses:
                return Response(
                    {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update status based on new value
            if new_status == 'confirmed':
                if booking.status != 'pending':
                    return Response(
                        {'error': 'Only pending bookings can be confirmed'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                booking.confirm()
            elif new_status == 'cancelled':
                if booking.status in ['cancelled', 'completed']:
                    return Response(
                        {'error': 'Cannot cancel this booking'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                booking.cancel()
            else:
                booking.status = new_status
                booking.save()

            return Response({
                'message': f'Booking status updated to {new_status}',
                'booking': BookingDetailSerializer(booking).data
            }, status=status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminBookingListView(generics.ListAPIView):
    """
    API endpoint for admins to view all bookings across all properties.
    """

    serializer_class = BookingListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return all bookings for admin users."""
        # Only allow admin users
        if self.request.user.role != 'admin':
            return Booking.objects.none()

        # Return ALL bookings, not just admin-approval properties
        return Booking.objects.select_related('property', 'tenant').order_by('-created_at')


class AdminBookingDetailView(generics.RetrieveAPIView):
    """
    API endpoint for admins to view booking details for admin-approval properties.
    """

    serializer_class = BookingDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return bookings for properties with admin approval type."""
        # Only allow admin users
        if self.request.user.role != 'admin':
            return Booking.objects.none()

        return Booking.objects.filter(property__approval_type='admin')


class AdminBookingConfirmView(APIView):
    """
    API endpoint for admins to confirm bookings for admin-approval properties.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """Confirm a booking."""
        # Check if user is admin
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can confirm bookings for admin-approval properties'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            booking = Booking.objects.get(pk=pk, property__approval_type='admin')

            if booking.status != 'pending':
                return Response(
                    {'error': 'Only pending bookings can be confirmed'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            booking.confirm()

            return Response({
                'message': 'Booking confirmed successfully',
                'booking': BookingDetailSerializer(booking).data
            }, status=status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found or not set for admin approval'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminBookingRejectView(APIView):
    """
    API endpoint for admins to reject/cancel bookings for admin-approval properties.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """Reject a booking."""
        # Check if user is admin
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can reject bookings for admin-approval properties'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            booking = Booking.objects.get(pk=pk, property__approval_type='admin')

            if booking.status in ['cancelled', 'completed']:
                return Response(
                    {'error': 'Cannot reject this booking'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            booking.cancel()

            return Response({
                'message': 'Booking rejected',
                'booking': BookingDetailSerializer(booking).data
            }, status=status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found or not set for admin approval'},
                status=status.HTTP_404_NOT_FOUND
            )
