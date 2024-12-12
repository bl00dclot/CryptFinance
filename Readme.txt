# Finance Blog

## Introduction
The Finance Blog is a full-stack web application that allows users to document and share hypothetical financial trades based on the latest market news. The platform supports user authentication, CRUD operations for blog posts, and displays real-time cryptocurrency data fetched from an external API. The project is styled in a nostalgic 2000s web theme.

---

## Features
- **User Authentication**: Secure JWT-based login and registration.
- **CRUD Functionality**: Users can create, update, delete, and view blog posts.
- **Cryptocurrency Insights**: Displays the top 10 cryptocurrencies by market cap using CoinGecko API.
- **Old-School Styling**: A throwback black-and-green CSS design inspired by early 2000s web aesthetics.

---

## Technologies Used
- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Middleware**: Body-parser, Morgan
- **External API**: CoinGecko

---

## Getting Started
Follow these steps to set up and run the project locally.

### Prerequisites
- Node.js and npm installed.
- PostgreSQL installed and running.
- Basic knowledge of running Node.js applications.

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd finance-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Access PostgreSQL CLI or your preferred GUI tool.
   - Create a new database named `finance_blog`.
   - Run the schema and seed script from `db_schema_and_seed.sql`.
     ```bash
     psql -U postgres -d finance_blog -f db_schema_and_seed.sql
     ```

4. Create a `.env` file in the project root and add the following variables:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=finance_blog
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000).

### Testing the Application
1. Register a new account via the frontend or use seeded users (`admin`, `user1`, `user2`).
   - Passwords: `admin123`, `user123`.

2. Create, edit, or delete blog posts.
3. Access cryptocurrency data via the "Crypto Insights" section.

---

## Future Improvements
- Add comment functionality for blog posts.
- Implement advanced authentication (e.g., OAuth).
- Enhance UI with responsive design.

---

## License
This project is open-source and available under the MIT License.


