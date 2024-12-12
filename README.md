# Matcha

Matcha is a dating platform designed to connect users based on their preferences, interests, and location. It features a streamlined matching process and includes additional functionalities such as profile customization, notifications, and secure chat.

---

## Features

1. **Authentication**:
   - Login with email, Google, or 42 School accounts.

2. **User Profiles**:
   - Required fields: first name, last name, email, gender, sexual orientation, age, and goal (e.g., date, love, or casual).
   - Users can upload profile pictures from storage or Google Photos.

3. **Matching System**:
   - Search for users.
   - Like profiles, and if two users like each other, they "match."
   - Matched users can chat securely.

4. **Notifications**:
   - Real-time notifications visible across the application with a maximum delay of 10 seconds.

5. **Security**:
   - Encrypted communication between client and server.
   - OTP-based account verification.

---

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS and ShadCN
- **Backend**: PostgreSQL with custom API routes (no ORM used)
- **Deployment**: Dockerized with multiple containers

---

## Installation

### Prerequisites
Ensure you have [Docker](https://www.docker.com/) installed on your machine.

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd matcha
   ```

2. Build and start the Docker containers:
   ```bash
   docker-compose up --build
   ```

   This command will build three containers:
   - **App Container**: Runs the Next.js application.
   - **Database Container**: Hosts the PostgreSQL database.
   - **WebSocket Container**: Handles real-time notifications.

---

## Environment Variables

Create a `.env` file in the root directory and populate it with the following:

```env
# PostgreSQL
POSTGRES_HOST=db
POSTGRES_DB=matcha
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL="postgresql://postgres:postgres@db:5432/matcha"
POSTGRES_PORT=5432

# Email Service
EMAIL_USERNAME="your email"
APP_PASSWORD="app password generated in your Google panel"

# APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your key"
NEXT_PUBLIC_IPIFY_API_KEY="your key"

# Encryption
NEXT_PUBLIC_ENCRYPTION_KEY="used to encrypt everything between API and client"

# Environment
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID="your client ID"
GOOGLE_CLIENT_SECRET="your client secret"
FORTY_TWO_CLIENT_ID="your client ID"
FORTY_TWO_CLIENT_SECRET="your client secret"
NEXTAUTH_SECRET="strong string"
NEXTAUTH_URL=http://localhost:3000
```

---

## Database Schema

The project uses a PostgreSQL database with custom API routes. Below are some key tables:

### Users
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    provider VARCHAR(255),
    gender VARCHAR(255),
    sexualOrientation VARCHAR(255),
    age INT,
    goal VARCHAR(255),
    height INT,
    tags VARCHAR(255),
    bio TEXT,
    nb_photos INT DEFAULT 0,
    location VARCHAR(255),
    city VARCHAR(255),
    friends VARCHAR(255),
    locationAccess BOOLEAN DEFAULT FALSE,
    fame INT DEFAULT 50,
    report_count INT DEFAULT 0,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

Other tables include `user_friends`, `profile_liked`, `profile_blocked`, `profile_reported`, `profile_views`, `otps`, `chat_message`, `chat_room`, `notifications`, and more. Refer to the source code for full details.

---

## Bonus Features

- Google and 42 login integration.
- Photo uploads from Google Photos.
- A new, interactive interface for user matching.
- Expanded notification features.
- OTP-based account verification.

---

## Deployment

The project is fully Dockerized. Use Docker Compose to run the application locally or deploy it to a production environment.

---

## Known Issues

- Chat feature currently does not support image uploads.
- Geolocation functionality may not work in older browsers.
- Large file uploads are not supported.

---

## Future Improvements

No future updates are planned at this time.

---

## License

This project is licensed under [your chosen license].

---

Enjoy using Matcha!