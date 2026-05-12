const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const COURSES_FILE = path.join(__dirname, 'courses.json');

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to enable CORS for frontend development
const cors = require('cors');
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read courses from JSON file
function readCourses() {
  try {
    if (!fs.existsSync(COURSES_FILE)) {
      // Create empty array if file doesn't exist
      fs.writeFileSync(COURSES_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(COURSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading courses file:', error);
    throw new Error('Failed to read courses data');
  }
}

// Helper function to write courses to JSON file
function writeCourses(courses) {
  try {
    fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
  } catch (error) {
    console.error('Error writing courses file:', error);
    throw new Error('Failed to write courses data');
  }
}

// Helper function to generate a new ID
function generateId(courses) {
  if (courses.length === 0) return 1;
  return Math.max(...courses.map(course => course.id)) + 1;
}

// Helper function to validate course data
function validateCourse(courseData) {
  const errors = [];
  
  if (!courseData.name || courseData.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!courseData.description || courseData.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!courseData.target_date) {
    errors.push('Target date is required');
  } else {
    // Basic date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(courseData.target_date)) {
      errors.push('Target date must be in YYYY-MM-DD format');
    }
  }
  
  const validStatuses = ['Not Started', 'In Progress', 'Completed'];
  if (!courseData.status || !validStatuses.includes(courseData.status)) {
    errors.push('Status must be one of: Not Started, In Progress, Completed');
  }
  
  return errors;
}

// GET /api/courses - Get all courses
app.get('/api/courses', (req, res) => {
  try {
    const courses = readCourses();
    res.json(courses);
  } catch (error) {
    console.error('Error in GET /api/courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bonus: GET /api/courses/stats - Get statistics about courses
app.get('/api/courses/stats', (req, res) => {
  try {
    const courses = readCourses();
    
    const stats = {
      total: courses.length,
      'Not Started': courses.filter(c => c.status === 'Not Started').length,
      'In Progress': courses.filter(c => c.status === 'In Progress').length,
      Completed: courses.filter(c => c.status === 'Completed').length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error in GET /api/courses/stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bonus: GET /api/courses/search?q=term - Search courses
app.get('/api/courses/search', (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }
    
    const courses = readCourses();
    const searchTerm = query.toLowerCase().trim();
    
    const filteredCourses = courses.filter(course => 
      course.name.toLowerCase().includes(searchTerm) || 
      course.description.toLowerCase().includes(searchTerm)
    );
    
    res.json(filteredCourses);
  } catch (error) {
    console.error('Error in GET /api/courses/search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/courses/:id - Get a specific course
app.get('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error in GET /api/courses/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/courses - Add a new course
app.post('/api/courses', (req, res) => {
  try {
    const courses = readCourses();
    const validationErrors = validateCourse(req.body);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    const newCourse = {
      id: generateId(courses),
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      target_date: req.body.target_date,
      status: req.body.status,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    courses.push(newCourse);
    writeCourses(courses);
    
     res.status(201).json(newCourse);
   } catch (error) {
     console.error('Error in POST /api/courses:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
});

// PUT /api/courses/:id - Update a course
app.put('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const courseId = parseInt(req.params.id);
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const validationErrors = validateCourse(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    const updatedCourse = {
      ...courses[courseIndex],
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      target_date: req.body.target_date,
      status: req.body.status
    };
    
    courses[courseIndex] = updatedCourse;
    writeCourses(courses);
    
     res.json(updatedCourse);
   } catch (error) {
     console.error('Error in PUT /api/courses/:id:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
});

// DELETE /api/courses/:id - Delete a course
app.delete('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const courseId = parseInt(req.params.id);
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const deletedCourse = courses.splice(courseIndex, 1)[0];
    writeCourses(courses);
    
    res.json(deletedCourse);
   } catch (error) {
     console.error('Error in DELETE /api/courses/:id:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;