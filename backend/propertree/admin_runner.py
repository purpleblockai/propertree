"""
HTTP endpoint to create superuser (for Render free tier - no shell access)
"""
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.conf import settings
from decouple import config
import io
import sys

User = get_user_model()


def create_superuser(request):
    """
    Create superuser via HTTP endpoint.
    Protected by ADMIN_SECRET_KEY environment variable.
    """
    # Check secret key
    secret_key = request.GET.get('key') or request.headers.get('X-Admin-Key')
    expected_key = config('ADMIN_SECRET_KEY', default='')
    
    if not expected_key or secret_key != expected_key:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    # Get parameters from query string or request body
    email = request.GET.get('email') or (request.POST.get('email') if hasattr(request, 'POST') else None)
    password = request.GET.get('password') or (request.POST.get('password') if hasattr(request, 'POST') else None)
    
    if not email or not password:
        return JsonResponse({
            'error': 'Missing parameters',
            'usage': 'Add ?email=admin@example.com&password=yourpassword&key=YOUR_SECRET_KEY'
        }, status=400)
    
    try:
        # Check if user exists
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.role = 'admin'
            user.is_verified = True
            user.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Superuser updated',
                'email': email,
                'admin_url': f'{request.scheme}://{request.get_host()}/admin/'
            })
        else:
            # Create new superuser
            user = User.objects.create_superuser(
                email=email,
                password=password,
                role='admin',
                is_verified=True
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Superuser created',
                'email': email,
                'admin_url': f'{request.scheme}://{request.get_host()}/admin/'
            })
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        return JsonResponse({
            'status': 'error',
            'message': str(e),
            'traceback': error_trace
        }, status=500)

