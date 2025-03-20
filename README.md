# Tasker Backend

## Project Overview

it is a task management website 

# Tasker

## Introduction

Welcome to **Tasker** where you can manage your task very easily




## Links

- [Frontend Hosted](https://tasker-virid.vercel.app)
- [Backend Hosted](https://taskmanagementbackend-aqxs.onrender.com/)
- [Frontend GitHub Repository](https://github.com/himanshu3434/taskManagement)
- [Backend GitHub Repository](https://github.com/himanshu3434/taskManagementBackend)

## Content Page

1. [Introduction](#introduction)
2. [Links](#links)
3. [Content Page](#content-page)
4. [Technology Used](#technology-used)
5. [Features](#features)
6. [Setup](#setup)
7. [Database Schema](#database-schema)
8. [Thank You](#thank-you)

### Technology Used

- React
- TypeScript
- Express
- React Router DOM
- Redux Toolkit
- Stripe
- Prisma
- PosgresSQL


## Setup

1. **Fork the Repository:** 
2. **Clone the Repository:**
   ```bash
   git clone <repository-url>

3. **Environment Variables:** Create a `.env` file in the root folder with the following schema:
   ```
    DATABASE_URL=""
    PORT=3000
    CORS_ORIGIN=http://localhost:5173


    ACCESS_TOKEN_SECRET=""
    ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=""
    REFRESH_TOKEN_EXPIRY=10d



   ```

4. **CORS Configuration:** Update the `CORS_ORIGIN` in the backend's `app.ts` file to the frontend URL, e.g., `http://localhost:5173` for local development.

5. **Install Dependencies:**
   ```bash
   npm install
6. In both frontend and backend directories
   ```bash
    npm run dev



   



## Thank You

**Happy Coding!**

**HY**

