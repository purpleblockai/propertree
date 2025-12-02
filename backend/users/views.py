"""
Simplified views for Users app.
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .models import Profile
from .serializers import (
    UserSerializer,
    UserDetailSerializer,
    UserProfileUpdateSerializer,
    LoginSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """API endpoint for user registration."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        """Create a new user."""
        # Handle FormData with nested profile fields
        if hasattr(request.data, '_mutable'):
            # This is a QueryDict (FormData)
            data = request.data.copy()
            
            # Check if we have nested profile fields (profile.*)
            has_nested_profile = any(key.startswith('profile.') for key in data.keys())
            
            if has_nested_profile:
                # Restructure nested profile fields
                profile_data = {}
                profile_keys = [key for key in data.keys() if key.startswith('profile.')]
                
                for key in profile_keys:
                    field_name = key.replace('profile.', '')
                    value = data.pop(key)
                    # Handle QueryDict list values
                    if isinstance(value, list):
                        profile_data[field_name] = value[0] if value else ''
                    else:
                        profile_data[field_name] = value
                
                # Handle profile photo from files
                if 'profile.profile_photo' in request.FILES:
                    profile_data['profile_photo'] = request.FILES['profile.profile_photo']
                
                # Convert remaining data to dict
                user_data = {}
                for key, value in data.items():
                    if isinstance(value, list):
                        user_data[key] = value[0] if value else ''
                    else:
                        user_data[key] = value
                
                # Add profile data
                user_data['profile'] = profile_data
                data = user_data
            else:
                # Regular FormData without nested fields - convert to dict
                data = {}
                for key, value in request.data.items():
                    if isinstance(value, list):
                        data[key] = value[0] if value else ''
                    else:
                        data[key] = value
                
                # Handle files if any
                if request.FILES:
                    for key, file in request.FILES.items():
                        data[key] = file
        
        try:
            serializer = self.get_serializer(data=data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            return Response({
                'message': 'User registered successfully',
                'user': UserDetailSerializer(user, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            # Return validation errors in a clear format
            return Response({
                'message': 'Invalid request',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the full error for debugging
            import traceback
            error_trace = traceback.format_exc()
            print(f"Registration error: {str(e)}")
            print(f"Traceback: {error_trace}")
            return Response({
                'message': 'Registration failed',
                'error': str(e),
                'detail': 'Please check server logs for more information'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    """API endpoint for user login."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Login user and return JWT tokens."""
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Login successful',
            'user': UserDetailSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """API endpoint for user logout."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Logout user."""
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    """API endpoint for viewing and updating user profile."""

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        """Return appropriate serializer based on request method."""
        if self.request.method in ['PATCH', 'PUT']:
            return UserProfileUpdateSerializer
        return UserDetailSerializer

    def get_object(self):
        """Return the current user."""
        return self.request.user

    def update(self, request, *args, **kwargs):
        """Update user profile and return updated data."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Return the updated data using UserDetailSerializer
        return Response(UserDetailSerializer(instance).data)
