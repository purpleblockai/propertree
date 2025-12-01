"""
WSGI config for Propertree project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'propertree.settings')

application = get_wsgi_application()
