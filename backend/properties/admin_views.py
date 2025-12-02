"""
Admin-specific views for property management.
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta

from .models import Property
from .serializers import PropertyDetailSerializer
from bookings.models import Booking
from users.models import CustomUser


class IsAdminUser(IsAuthenticated):
    """Permission class to check if user is admin."""
    
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'admin'


class AdminDashboardStatsView(APIView):
    """API endpoint for admin dashboard statistics."""
    
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """Get dashboard statistics for admin."""
        try:
            # Property stats
            total_properties = Property.objects.count()
            pending_properties = Property.objects.filter(status='pending_approval').count()
            active_properties = Property.objects.filter(status='approved').count()
            rejected_properties = Property.objects.filter(status='rejected').count()
            
            # User stats
            total_users = CustomUser.objects.count()
            total_landlords = CustomUser.objects.filter(role='landlord').count()
            total_tenants = CustomUser.objects.filter(role='tenant').count()
            
            # Booking stats
            total_bookings = Booking.objects.count()
            pending_bookings = Booking.objects.filter(status='pending').count()
            confirmed_bookings = Booking.objects.filter(status='confirmed').count()
            
            # Revenue stats
            total_revenue = Booking.objects.filter(
                status__in=['confirmed', 'completed']
            ).aggregate(Sum('total_price'))['total_price__sum'] or 0
            
            # Monthly revenue (last 30 days)
            thirty_days_ago = timezone.now() - timedelta(days=30)
            monthly_revenue = Booking.objects.filter(
                status__in=['confirmed', 'completed'],
                created_at__gte=thirty_days_ago
            ).aggregate(Sum('total_price'))['total_price__sum'] or 0
            
            # Recent activity (last 7 days)
            seven_days_ago = timezone.now() - timedelta(days=7)
            recent_properties = Property.objects.filter(created_at__gte=seven_days_ago).count()
            recent_bookings = Booking.objects.filter(created_at__gte=seven_days_ago).count()
            recent_users = CustomUser.objects.filter(created_at__gte=seven_days_ago).count()
            
            return Response({
                'properties': {
                    'total': total_properties,
                    'pending': pending_properties,
                    'active': active_properties,
                    'rejected': rejected_properties,
                    'recent': recent_properties
                },
                'users': {
                    'total': total_users,
                    'landlords': total_landlords,
                    'tenants': total_tenants,
                    'recent': recent_users
                },
                'bookings': {
                    'total': total_bookings,
                    'pending': pending_bookings,
                    'confirmed': confirmed_bookings,
                    'recent': recent_bookings
                },
                'revenue': {
                    'total': float(total_revenue),
                    'monthly': float(monthly_revenue),
                    'average_booking': float(total_revenue / total_bookings) if total_bookings > 0 else 0
                }
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PendingPropertiesView(generics.ListAPIView):
    """API endpoint to list all pending properties for admin review."""
    
    serializer_class = PropertyDetailSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        """Return all pending properties."""
        return Property.objects.filter(status='pending_approval').order_by('-created_at')


class ApprovePropertyView(APIView):
    """API endpoint to approve a property."""
    
    permission_classes = [IsAdminUser]
    
    def post(self, request, pk):
        """Approve a property."""
        try:
            property_obj = Property.objects.get(pk=pk)
            
            if property_obj.status != 'pending_approval':
                return Response(
                    {'error': 'Only pending properties can be approved'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            property_obj.status = 'approved'
            property_obj.approved_by = request.user
            property_obj.approved_at = timezone.now()
            property_obj.save()
            
            return Response({
                'message': 'Property approved successfully',
                'property': PropertyDetailSerializer(property_obj).data
            })
            
        except Property.DoesNotExist:
            return Response(
                {'error': 'Property not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class RejectPropertyView(APIView):
    """API endpoint to reject a property."""
    
    permission_classes = [IsAdminUser]
    
    def post(self, request, pk):
        """Reject a property with a reason."""
        try:
            property_obj = Property.objects.get(pk=pk)
            
            if property_obj.status != 'pending_approval':
                return Response(
                    {'error': 'Only pending properties can be rejected'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            reason = request.data.get('reason', '')
            if not reason:
                return Response(
                    {'error': 'Rejection reason is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            property_obj.status = 'rejected'
            property_obj.rejection_reason = reason
            property_obj.save()
            
            return Response({
                'message': 'Property rejected successfully',
                'property': PropertyDetailSerializer(property_obj).data
            })
            
        except Property.DoesNotExist:
            return Response(
                {'error': 'Property not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AllPropertiesAdminView(generics.ListAPIView):
    """API endpoint to list all properties for admin (all statuses)."""
    
    serializer_class = PropertyDetailSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        """Return all properties with filtering options."""
        queryset = Property.objects.all().order_by('-created_at')
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by owner
        owner_id = self.request.query_params.get('owner_id')
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)
        
        return queryset


class AdminUsersListView(generics.ListAPIView):
    """API endpoint to list all users for admin."""
    
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """Get all users with statistics."""
        try:
            users = CustomUser.objects.all().order_by('-created_at')
            
            # Filter by role
            role_filter = request.query_params.get('role')
            if role_filter:
                users = users.filter(role=role_filter)
            
            users_data = []
            for user in users:
                # Get user's property count if landlord
                property_count = 0
                if user.role == 'landlord':
                    property_count = Property.objects.filter(landlord=user).count()
                
                # Get user's booking count if tenant
                booking_count = 0
                if user.role == 'tenant':
                    booking_count = Booking.objects.filter(tenant=user).count()
                
                users_data.append({
                    'id': str(user.id),
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'full_name': user.get_full_name(),
                    'role': user.role,
                    'is_active': user.is_active,
                    'is_verified': user.is_verified,
                    'created_at': user.created_at,
                    'property_count': property_count,
                    'booking_count': booking_count
                })
            
            return Response({
                'count': len(users_data),
                'results': users_data
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PropertyAnalyticsView(APIView):
    """API endpoint for property analytics."""
    
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """Get property analytics data."""
        try:
            # Properties by type
            by_type = Property.objects.values('property_type').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Properties by status
            by_status = Property.objects.values('status').annotate(
                count=Count('id')
            )
            
            # Properties by city (top 10)
            by_city = Property.objects.values('city').annotate(
                count=Count('id')
            ).order_by('-count')[:10]
            
            # Average price by property type
            avg_price_by_type = Property.objects.values('property_type').annotate(
                avg_price=Avg('base_price')
            )
            
            # Properties created over time (last 12 months)
            twelve_months_ago = timezone.now() - timedelta(days=365)
            monthly_data = []
            for i in range(12):
                month_start = timezone.now() - timedelta(days=30 * (11 - i))
                month_end = timezone.now() - timedelta(days=30 * (10 - i))
                count = Property.objects.filter(
                    created_at__gte=month_start,
                    created_at__lt=month_end
                ).count()
                monthly_data.append({
                    'month': month_start.strftime('%b %Y'),
                    'count': count
                })
            
            return Response({
                'by_type': list(by_type),
                'by_status': list(by_status),
                'by_city': list(by_city),
                'avg_price_by_type': list(avg_price_by_type),
                'monthly_trend': monthly_data
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AssetPerformanceView(APIView):
    """API endpoint for asset performance and KPIs."""
    
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """Get asset performance data."""
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        # Revenue calculations
        confirmed_bookings = Booking.objects.filter(
            status__in=['confirmed', 'completed'],
            created_at__gte=start_date
        )
        
        total_revenue = confirmed_bookings.aggregate(Sum('total_price'))['total_price__sum'] or 0
        
        # Previous period for comparison
        prev_start = start_date - timedelta(days=days)
        prev_bookings = Booking.objects.filter(
            status__in=['confirmed', 'completed'],
            created_at__gte=prev_start,
            created_at__lt=start_date
        )
        prev_revenue = prev_bookings.aggregate(Sum('total_price'))['total_price__sum'] or 0
        revenue_change = ((total_revenue - prev_revenue) / prev_revenue * 100) if prev_revenue > 0 else 0
        
        # Occupancy rate
        total_properties = Property.objects.filter(status='approved').count()
        booked_properties = Booking.objects.filter(
            status__in=['confirmed', 'completed'],
            check_in__lte=timezone.now().date(),
            check_out__gte=timezone.now().date()
        ).values('property').distinct().count()
        occupancy_rate = (booked_properties / total_properties * 100) if total_properties > 0 else 0
        
        # Average booking value
        booking_count = confirmed_bookings.count()
        avg_booking_value = (total_revenue / booking_count) if booking_count > 0 else 0
        
        # Monthly revenue data
        monthly_data = []
        for i in range(6):
            month_start = timezone.now() - timedelta(days=30 * (5 - i))
            month_end = timezone.now() - timedelta(days=30 * (4 - i))
            month_revenue = Booking.objects.filter(
                status__in=['confirmed', 'completed'],
                created_at__gte=month_start,
                created_at__lt=month_end
            ).aggregate(Sum('total_price'))['total_price__sum'] or 0
            monthly_data.append({
                'month': month_start.strftime('%b'),
                'revenue': float(month_revenue),
                'expenses': float(month_revenue * 0.3),  # Mock expenses
                'profit': float(month_revenue * 0.7)
            })
        
        # Property performance
        property_performance = []
        properties = Property.objects.filter(status='approved')[:10]
        for prop in properties:
            prop_bookings = Booking.objects.filter(
                property=prop,
                status__in=['confirmed', 'completed'],
                created_at__gte=start_date
            )
            prop_revenue = prop_bookings.aggregate(Sum('total_price'))['total_price__sum'] or 0
            prop_booking_count = prop_bookings.count()
            # Mock occupancy calculation
            prop_occupancy = min(100, (prop_booking_count * 2.5))
            
            property_performance.append({
                'property': prop.title,
                'revenue': float(prop_revenue),
                'bookings': prop_booking_count,
                'occupancy': round(prop_occupancy, 1)
            })
        
        # Expense categories (mock data structure)
        expense_categories = [
            {'name': 'Management Fees', 'value': 18000, 'color': '#3b82f6'},
            {'name': 'Mortgage/Loan', 'value': 36000, 'color': '#10b981'},
            {'name': 'Cleaning', 'value': 21750, 'color': '#f59e0b'},
            {'name': 'Maintenance', 'value': 11500, 'color': '#ef4444'},
            {'name': 'Utilities', 'value': 26200, 'color': '#8b5cf6'},
            {'name': 'Taxes', 'value': 22900, 'color': '#ec4899'},
        ]
        
        return Response({
            'kpis': {
                'total_revenue': float(total_revenue),
                'revenue_change': round(revenue_change, 1),
                'occupancy_rate': round(occupancy_rate, 1),
                'occupancy_change': 5.2,  # Mock change
                'average_booking_value': round(avg_booking_value, 2),
                'booking_value_change': -2.1,  # Mock change
                'total_bookings': booking_count,
                'bookings_change': 8.3,  # Mock change
            },
            'monthly_revenue': monthly_data,
            'property_performance': property_performance,
            'expense_categories': expense_categories
        })

