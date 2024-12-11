# Overview
This project is a full-stack web application that combines a React frontend with a Django backend, all containerized using Docker. The application is designed to provide a seamless development experience by utilizing Docker Compose to manage multiple services, including a PostgreSQL database.
Project Structure
javascript

## /project-root
```sh
│
├── /backendapi          # Django backend code
│   ├── Dockerfile       # Dockerfile for the Django application
│   ├── entrypoint.sh    # Entrypoint script for the Django application
│   └── .env             # Environment variables for the Django application
│
├── /frontend            # React frontend code
│   ├── Dockerfile       # Dockerfile for the React application
│   └── package.json     # React application dependencies
│
└── docker-compose.yml    # Docker Compose configuration file
```

### Getting Started
* Prerequisites
- Docker: Ensure you have Docker installed on your machine. You can download it from Docker's official website.
- Docker Compose: This is included with Docker Desktop installations.
Running the Application
Clone the repository:
bash

```sh
git clone <repository-url>
cd <repository-directory>
```
Build and start the services:
bash

```sh
docker-compose build
docker-compose up
```

### Access the application:
- The Django API will be available at http://localhost:8000.
- The React frontend will be available at http://localhost:3000.