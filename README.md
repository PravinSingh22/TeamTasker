# Project-1: Full-Stack Task Management Application

This is a full-stack web application for task management, featuring a React frontend, a Node.js/Express backend, and a MongoDB Atlas database. The entire development environment is containerized using Docker for easy setup and consistency.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup & Run with Docker (Recommended)](#setup--run-with-docker-recommended)
  - [Setup & Run Locally (Without Docker)](#setup--run-locally-without-docker)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)

---

## Architecture Overview

The application is designed with a modern, decoupled, three-tier architecture.

### 1. Frontend
*   **Framework:** **React** (with Vite)
*   **State Management:** **Redux Toolkit**
*   **Routing:** **React Router**
*   **Reasoning:** React is a powerful and popular library for building dynamic user interfaces. Redux Toolkit provides a simple and effective way to manage global application state, and React Router is the standard for handling client-side routing. Vite offers a lightning-fast development experience.

### 2. Backend
*   **Runtime:** **Node.js**
*   **Framework:** **Express.js**
*   **Database ORM:** **Mongoose**
*   **Reasoning:** The Node.js/Express stack is a robust and widely-used choice for building scalable REST APIs. Its non-blocking, event-driven nature is perfect for I/O-heavy applications. Mongoose provides a straightforward, schema-based solution to model application data, offering a higher level of abstraction for MongoDB.

### 3. Database
*   **Service:** **MongoDB Atlas**
*   **Reasoning:** MongoDB Atlas is a fully-managed, cloud-hosted database service. Using Atlas offloads the complexities of database administration, such as setup, scaling, and backups. Its NoSQL document model offers great flexibility, which is ideal for evolving application requirements.

### 4. Containerization
*   **Tool:** **Docker & Docker Compose**
*   **Reasoning:** Docker provides a consistent and isolated environment for both the frontend and backend services. `docker-compose` orchestrates the multi-container setup, allowing the entire application stack to be started with a single command, which drastically simplifies the development and onboarding process.

---

## Features

*   User authentication and management.
*   Create, view, update, and delete projects.
*   Create, view, update, and delete tasks within projects.
*   Assign tasks to users.
*   Real-time notifications and activity logging.

---

## Getting Started

### Prerequisites

*   **Node.js** (v18.x or later)
*   **npm** (or yarn/pnpm)
*   **Docker** and **Docker Compose** (for the containerized setup)
*   A **MongoDB Atlas** account and a connection string. Create a free cluster here.

### Setup & Run with Docker (Recommended)

This is the ideal way to run the project, as it handles all dependencies and services with a single command.

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd Project-1
    ```

2.  **Configure Backend Environment:**
    Create a `.env` file inside the `backend/` directory. You can copy the example file:
    ```sh
    cp backend/.env.example backend/.env
    ```
    Now, open `backend/.env` and add your MongoDB Atlas connection string (see Environment Variables).

3.  **Build and Run:**
    From the project root directory, run:
    ```sh
    docker-compose up --build
    ```
    This command will build the Docker images for the frontend and backend, start the services, and automatically seed the database.

4.  **Access the Application:**
    *   Frontend: http://localhost:3000
    *   Backend API: http://localhost:4000

### Setup & Run Locally (Without Docker)

1.  **Clone and Configure:**
    Follow steps 1 and 2 from the Docker setup above.

2.  **Install Backend Dependencies:**
    ```sh
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Run the Application:**
    You will need two separate terminal windows.

    *   **Terminal 1: Start the Backend**
        ```sh
        cd backend
        npm run dev
        ```
        *Note: The backend will automatically seed the database on its first start because of the `npm run seed` command in the `dev` script.*

    *   **Terminal 2: Start the Frontend**
        ```sh
        cd frontend
        npm start
        ```

5.  **Access the Application:**
    *   Frontend: http://localhost:3000

---

## Environment Variables

The backend service requires the following environment variables, which should be placed in `backend/.env`:

| Variable    | Description                                                                                             | Default                  |
|-------------|---------------------------------------------------------------------------------------------------------|--------------------------|
| `MONGO_URI` | **Required.** The connection string for your MongoDB Atlas database.                                      | `mongodb://127.0.0.1/db` |
| `PORT`      | The port on which the backend server will run.                                                          | `4000`                   |
| `JWT_SECRET`| A secret key for signing JSON Web Tokens for authentication.                                              | `your-jwt-secret`        |

---

## Database Seeding

The project includes a seed script to populate the database with sample users, projects, and tasks. This is useful for first-time setup and for providing evaluators with a non-empty application.

### Automatic Seeding

When you run the application using `docker-compose up` or `npm run dev` in the backend, the database is automatically cleared and re-seeded. This is configured in `docker-compose.yml` and `backend/package.json`.

### Manual Seeding

If you need to re-seed the database manually at any time, you can run the following command from the `backend/` directory:

```sh
npm run seed
```