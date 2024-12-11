from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status, filters
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, logout
from .models import User, Task
from . import serializers as serial


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
    }


class RegisterUserAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = serial.UserAuthSerializer(data=request.data)
        if serializer.is_valid():
            username = request.data['username']
            password = request.data['password']
            user, created = User.objects.get_or_create(username=username)
            if created:
                user.set_password(password)
                user.save()
                response = get_tokens_for_user(user)
                return Response(response, status=status.HTTP_201_CREATED)
            return Response(
                {"error": "User with this username already exists!"},
                status=status.HTTP_400_BAD_REQUEST)
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUserAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = serial.UserAuthSerializer(data=request.data)
        if serializer.is_valid():
            username = request.data['username']
            password = request.data['password']
            user = authenticate(request,
                                username=username,
                                password=password)
            if user:
                response = get_tokens_for_user(user)
                return Response(response, status=status.HTTP_200_OK)

            user = User.objects.filter(username=username).first()
            if not user:
                return Response(
                    {"error": "Please provide correct username!"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {'error': 'Given Password is not correct!'},
                    status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class TaskManageViewset(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serial.TaskManageSerializer
    queryset = Task.objects.all()
    filter_backends = [filters.OrderingFilter,
                       filters.SearchFilter]
    search_fields = ['title', 'due_date', 'status']

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.order_by('-updated_at')
        return queryset


class LogoutUser(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            logout(request)
            return Response(
                'User is successfully Logout',
                status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
