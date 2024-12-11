from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('task', views.TaskManageViewset, basename="task_management")

urlpatterns = [
    path('register/', views.RegisterUserAPIView.as_view()),
    path('login/', views.LoginUserAPIView.as_view()),
    path('logout/', views.LogoutUser.as_view())
] + router.urls
