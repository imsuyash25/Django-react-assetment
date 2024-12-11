from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Task
from rest_framework.test import APIClient


class RegisterUserAPITest(APITestCase):
    def test_register_user_success(self):
        """Test successful user registration"""
        data = {
            "username": "testuser",
            "password": "securepassword"
        }
        response = self.client.post('/api/v1/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)

    def test_register_user_already_exists(self):
        """Test registration with an existing username"""
        User.objects.create_user(username="testuser", password="securepassword")
        data = {
            "username": "testuser",
            "password": "securepassword"
        }
        response = self.client.post('/api/v1/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "User with this username already exists!")

    def test_register_user_invalid_data(self):
        """Test registration with invalid data"""
        data = {
            "username": "",
            "password": "securepassword"
        }
        response = self.client.post('/api/v1/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginUserAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="securepassword")

    def test_login_user_success(self):
        """Test successful login"""
        data = {
            "username": "testuser",
            "password": "securepassword"
        }
        response = self.client.post('/api/v1/login/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_user_incorrect_password(self):
        """Test login with incorrect password"""
        data = {
            "username": "testuser",
            "password": "wrongpassword"
        }
        response = self.client.post('/api/v1/login/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Given Password is not correct!")


class TaskManageViewsetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="securepassword")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.task = Task.objects.create(title="Test Task", due_date="2024-12-31", status="pending")

    def test_list_tasks_authenticated(self):
        """Test listing tasks for an authenticated user"""
        response = self.client.get('/api/v1/task/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
       
    def test_create_task_authenticated(self):
        """Test creating a task for an authenticated user"""
        data = {
            "title": "New Task",
            "due_date": "2024-12-31",
            "status": "pending"
        }
        response = self.client.post('/api/v1/task/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], "New Task")

    def test_unauthorized_access_to_tasks(self):
        """Test accessing tasks without authentication"""
        self.client.logout()
        response = self.client.get('/api/v1/task/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
