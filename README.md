# Project Tracker

This is the backend for a Project Tracker application built using **NestJS**, **PostgreSQL**, and **TypeORM**.

Docker is used for local development, and migration scripts are included for managing entities.

---

## 📁 Entity Management

To update or manage entities and migrations, refer to the following directory:

```
src/database/core
```

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

#### Step 1: Clone the repository

```
git clone https://github.com/ppiratess/project-tracker-be.git
```

#### Step 2: Create a .env file in the root

Go into the project directory

```
cd project-tracker-be
```

Create a `.env` file. You can refer to **.env.example** file.

#### Step 3: Start the application using Docker

- Build and run the containers in detached mode:

```
docker compose up --build -d
```

- To verify containers are running, use Docker Desktop or run:

```
docker ps
```

If you encounter any error along the lines of "port 3000 already in use. " You can either stop the application that is using the port or you can choose the next port for the host in file named `compose`, in the section.
The format is <host_port>:<container_port>

```
ports:
      - '3000:3000'
      - '5555:5555'
```

#### Step 4: Verify the application

Once the containers are up, open your browser and visit:

- http://localhost:3000/
- or http://host.docker.internal:3000/
- or your custom port http://localhost:<custom-port-defined-in-compose-file>/

### Project Structure

```
project-tracker-be/
├── src/
│   ├── common/           # Common DTOs
│   ├── config/           # App configs (e.g., TypeORM)
│   ├── database/
│   │   ├── core/         # Entities
│   │   └── migrations/   # Migrations
│   ├── enums/            # Enums used across the app
│   ├── modules/          # Feature modules
│   └── utils/            # Utility functions/helpers
├── .env
├── .env.example
├── docker-compose.yml
├── README.md
└── ...
```
