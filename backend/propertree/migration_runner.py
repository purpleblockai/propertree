"""
Temporary migration runner endpoint for Render free tier (no shell access)
"""
from django.http import JsonResponse
from django.core.management import call_command
from django.conf import settings
from decouple import config
import io
import sys


def run_migrations(request):
    """
    Run migrations via HTTP endpoint.
    Protected by MIGRATION_SECRET_KEY environment variable.
    """
    # Check secret key
    secret_key = request.GET.get('key') or request.headers.get('X-Migration-Key')
    expected_key = config('MIGRATION_SECRET_KEY', default='')
    
    if not expected_key or secret_key != expected_key:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    # Capture output
    old_stdout = sys.stdout
    sys.stdout = buffer = io.StringIO()
    
    try:
        # Run migrations
        call_command('migrate', verbosity=2, interactive=False)
        output = buffer.getvalue()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Migrations completed',
            'output': output
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e),
            'output': buffer.getvalue()
        }, status=500)
    finally:
        sys.stdout = old_stdout


def collect_static(request):
    """
    Collect static files via HTTP endpoint.
    Protected by MIGRATION_SECRET_KEY environment variable.
    """
    secret_key = request.GET.get('key') or request.headers.get('X-Migration-Key')
    expected_key = config('MIGRATION_SECRET_KEY', default='')
    
    if not expected_key or secret_key != expected_key:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    old_stdout = sys.stdout
    sys.stdout = buffer = io.StringIO()
    
    try:
        call_command('collectstatic', verbosity=2, interactive=False, clear=True)
        output = buffer.getvalue()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Static files collected',
            'output': output
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e),
            'output': buffer.getvalue()
        }, status=500)
    finally:
        sys.stdout = old_stdout

