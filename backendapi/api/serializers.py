from .models import User, Task
from rest_framework import serializers


class UserAuthSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['username', 'password']


class TaskManageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
