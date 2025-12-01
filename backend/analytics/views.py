"""
Views for Analytics app.
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.utils import timezone

from .utils import LandlordAnalytics, AdminAnalytics


class LandlordDashboardView(APIView):
    """API endpoint for landlord dashboard KPIs."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all KPIs for landlord dashboard."""
        try:
            if not request.user.is_landlord():
                return Response({
                    'error': 'Only landlords can access this endpoint.'
                }, status=status.HTTP_403_FORBIDDEN)

            # Get date range from query params
            end_date = timezone.now().date()
            start_date = end_date - timedelta(days=30)  # Default: last 30 days

            if request.query_params.get('start_date'):
                start_date = datetime.strptime(request.query_params.get('start_date'), '%Y-%m-%d').date()
            if request.query_params.get('end_date'):
                end_date = datetime.strptime(request.query_params.get('end_date'), '%Y-%m-%d').date()

            analytics = LandlordAnalytics(request.user)

            dashboard_data = {
                'properties': analytics.get_total_properties(),
                'occupancy_rate': analytics.get_occupancy_rate(start_date, end_date),
                'rental_income': analytics.get_rental_income(start_date, end_date),
                'pending_bookings': analytics.get_pending_bookings(),
                'maintenance_costs': analytics.get_maintenance_costs(start_date, end_date),
                'property_expenses': analytics.get_property_expenses(start_date, end_date),
                'average_booking': analytics.get_average_booking_duration(),
                'noi': analytics.get_noi(start_date, end_date),
                'property_performance': analytics.get_property_performance(),
                'monthly_cash_flow': analytics.get_monthly_cash_flow(start_date, end_date),
                'annual_expenses': analytics.get_annual_expenses_summary(),
                'date_range': {
                    'start_date': start_date.isoformat(),
                    'end_date': end_date.isoformat()
                }
            }

            return Response(dashboard_data, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"Dashboard Error: {str(e)}")
            print(error_trace)
            return Response({
                'error': f'Internal server error: {str(e)}',
                'trace': error_trace if request.user.is_admin_user() else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminDashboardView(APIView):
    """API endpoint for admin dashboard KPIs."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all KPIs for admin dashboard."""
        if not request.user.is_admin_user():
            return Response({
                'error': 'Only admins can access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)

        dashboard_data = {
            'open_maintenance_tickets': AdminAnalytics.get_open_maintenance_tickets(),
            'average_resolution_time': AdminAnalytics.get_average_resolution_time(),
            'occupancy_ratio': AdminAnalytics.get_occupancy_ratio(),
            'rent_collection_rate': AdminAnalytics.get_rent_collection_rate(),
            'platform_statistics': AdminAnalytics.get_platform_statistics(),
        }

        return Response(dashboard_data, status=status.HTTP_200_OK)
