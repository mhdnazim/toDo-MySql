# Todo App (Next.js + MySQL)

A simple todo app built with **Next.js 15** and **MySQL**.

## Setup

1. **Install dependencies**

   ```bash
   cd todo-app && npm install
   ```

2. **MySQL**

   - Ensure MySQL is running locally (or use a cloud instance).
   - Create the database and table (or run the init script):

   ```bash
   mysql -u root -p < scripts/init-db.sql
   ```

   Or in the MySQL shell:

   ```sql
   CREATE DATABASE IF NOT EXISTS todo_app;
   USE todo_app;
   CREATE TABLE IF NOT EXISTS todos (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     completed BOOLEAN NOT NULL DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Environment**

   Copy `.env.example` to `.env` and set your MySQL credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=todo_app
   ```

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Features

- List all todos
- Add a new todo
- Toggle completed state
- Delete a todo

## Stack

- **Next.js 15** (App Router)
- **MySQL** (via `mysql2`)
- **Tailwind CSS** (styling)
- **TypeScript**
