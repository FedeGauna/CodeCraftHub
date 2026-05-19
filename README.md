# CodeCraftHub - Personal Learning Goal Tracker API

A simple REST API built with Node.js and Express to help developers track courses they want to learn, featuring a web dashboard for managing courses. This project focuses on learning REST API basics with JSON file storage.

## Features

- CRUD operations for learning courses
- JSON file-based data storage (no database required)
- Input validation and error handling
- Statistics endpoint to track learning progress
- Search functionality for courses
- Auto-generated IDs and timestamps
- Web dashboard at `/dashboard.html` for course management
- CORS enabled for frontend development

## API Endpoints

### Course Management

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course by ID
- `POST /api/courses` - Add a new course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course

### Bonus Endpoints

- `GET /api/courses/stats` - Get statistics about courses
- `GET /api/courses/search?q=term` - Search courses by name or description

## Course Data Structure

Each course has the following properties:

- `id` (number): Auto-generated unique identifier
- `name` (string): Course name (required)
- `description` (string): Course description (required)
- `target_date` (string): Target completion date in YYYY-MM-DD format (required)
- `status` (string): Current status - "Not Started", "In Progress", or "Completed" (required)
- `created_at` (string): Timestamp when course was created (auto-generated)

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
pnpm install
```

## How to Run

### Production Mode

```bash
pnpm start
```

### Development Mode (with auto-restart)

```bash
pnpm dev
```

The server will run on `http://localhost:5000`

## API Usage Examples

### Get All Courses
```bash
curl http://localhost:5000/api/courses
```

### Get a Specific Course
```bash
curl http://localhost:5000/api/courses/1
```

### Add a New Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript Basics",
    "description": "Learn JavaScript fundamentals",
    "target_date": "2025-12-31",
    "status": "Not Started"
  }'
```

### Update a Course
```bash
curl -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced JavaScript",
    "description": "Learn advanced JavaScript concepts",
    "target_date": "2025-12-31",
    "status": "In Progress"
  }'
```

### Delete a Course
```bash
curl -X DELETE http://localhost:5000/api/courses/1
```

### Get Course Statistics
```bash
curl http://localhost:5000/api/courses/stats
```

### Search Courses
```bash
curl "http://localhost:5000/api/courses/search?q=javascript"
```

## Web Dashboard

A single-page dashboard is available at `/dashboard.html` (served directly by the Express app). It provides:

- **Course list** displayed as responsive cards with status badges
- **Add course form** with validation for all required fields
- **Edit modal** to update course details inline
- **Delete** with confirmation dialog
- **Toast notifications** for success/error feedback
- **Loading states** and error handling for all API operations

Built with vanilla JavaScript and CSS. No frameworks or build tools required.

### How to Use

1. Start the server with `pnpm start`
2. Open `http://localhost:5000/dashboard.html` in your browser
3. Use the form to add courses; edit or delete them from the card list

## Troubleshooting

- **Server won't start**: Make sure you have Node.js installed and run `pnpm install` first
- **Port already in use**: Change the PORT constant in app.js or stop the conflicting process
- **File permissions**: Ensure the application has read/write permissions for the courses.json file
- **Invalid JSON**: If courses.json becomes corrupted, delete it and the API will create a new empty array

## Project Structure

```
codecrafthub/
├── app.js              # Main Express application
├── courses.json        # JSON file for data storage (auto-created)
├── package.json        # Node.js dependencies
├── README.md           # Project documentation
├── .gitignore          # patterns to ignore in versioning
└── public/
    └── dashboard.html  # Web-based learning management dashboard
```

## Learning Notes

This project demonstrates:
- Basic Express.js routing
- REST API design principles
- JSON file storage implementation
- Request/response handling
- Error handling and validation
- Middleware usage (express.json())

Perfect for beginners learning backend development with Node.js!