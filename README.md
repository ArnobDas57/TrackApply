TrackApply: Job Application Tracker
TrackApply is a full-stack web application designed to help users efficiently manage and track their job applications. It features a React frontend, a Node.js Express backend, and uses PostgreSQL (via Supabase) for data storage.

Table of Contents
1. Features
2. Prerequisites
3. Getting Started
    1. Database Setup (Supabase)
    2. Backend Setup
    3. Frontend Setup

Features
- User Authentication: Secure signup and login for users.
- Job Application Tracking: Add, view, edit, and delete job application records.
- Application Statuses: Track job progress with predefined statuses (Wishlist, Applied, Shortlisted, Interviewing, Offer, Rejected).
- Search and Filter: Easily find applications by company/position and filter by status.
- Responsive UI: Built with Material-UI for a modern and adaptive user experience.
- Dark Theme: Toggle between light and dark modes.

Prerequisites
Before you begin, ensure you have the following installed on your machine:
- Node.js & npm (or Yarn): Download Node.js (npm is included).
- Verify installation: node -v and npm -v
- PostgreSQL Client (Optional, but recommended): For direct database interaction, psql or a GUI like DBeaver/pgAdmin.
- Git: For cloning the repository.

Getting Started
Follow these steps to get TrackApply up and running on your local machine.

1. Database Setup (Supabase)
   
This project uses PostgreSQL as its database, hosted and managed by Supabase.
    Create a Supabase Account:
    - Go to Supabase and sign up for a free account.

Create a New Project:

In your Supabase dashboard, click "New Project."

Choose an organization, provide a project name, and set a strong database password. Choose a region close to you.

Get Database Connection String:

Once your project is created, navigate to Project Settings > Database.

Under the "Connection String" section, copy the URI for direct connection (it usually starts with postgresql://). This will be used in your backend's .env file.

Create Tables (or Run Migrations):

Go to the SQL Editor in your Supabase dashboard.

Create the necessary tables. Here's the DDL for your users and jobs tables:

-- For the 'users' table (if you don't have it already)
CREATE TABLE public.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the ENUM type for application_status (MUST be run before jobs table if not exists)
CREATE TYPE application_status_enum AS ENUM (
    'Wishlist',
    'Applied',
    'Shortlisted',
    'Interviewing',
    'Offer',
    'Rejected'
);

-- For the 'jobs' table
CREATE TABLE public.jobs (
    job_id SERIAL NOT NULL,
    user_id INTEGER NULL,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_location TEXT NULL,
    date_applied DATE NULL,
    salary_range TEXT NULL,
    application_status application_status_enum NOT NULL DEFAULT 'Wishlist', -- Use the ENUM type
    job_description_url TEXT NULL,
    resume_version TEXT NULL,
    cover_letter_sent BOOLEAN NULL DEFAULT FALSE,
    notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    interview_date TIMESTAMP WITH TIME ZONE NULL,
    offer_date DATE NULL,
    response_deadline DATE NULL,
    rejection_date DATE NULL,
    CONSTRAINT jobs_pkey PRIMARY KEY (job_id),
    CONSTRAINT jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) TABLESPACE pg_default;

Execute these queries to set up your database schema.

2. Backend Setup
Clone the Repository:

git clone <your-repository-url>
cd <your-project-folder>

Navigate to Backend Directory:

cd backend # or cd server, depending on your project structure

Install Dependencies:

npm install
# or yarn install

Create .env File:

Create a file named .env in the backend directory (at the same level as package.json).

Add your Supabase database connection string and a JWT secret.

SUPABASE_DB_URL="postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.xxxxxxxxxxxx.supabase.co:5432/postgres"
JWT_SECRET="YOUR_VERY_STRONG_AND_UNIQUE_SECRET_KEY" # Generate a long, random string

Important: Replace YOUR_SUPABASE_PASSWORD with the actual password you set for your Supabase project. Replace YOUR_VERY_STRONG_AND_UNIQUE_SECRET_KEY with a randomly generated string.

Start the Backend Server:

npm start # Or npm run dev if you have a nodemon script

The server should start on http://localhost:5000 (or your configured port).

3. Frontend Setup
Navigate to Frontend Directory:

Open a new terminal window and navigate to the frontend directory:

cd ../frontend # Or cd client, depending on your project structure

