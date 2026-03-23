import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  image_url: string;
  created_at: string;
}

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content: string;
  order_index: number;
  duration_minutes: number;
  created_at: string;
}

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  enrolled_at: string;
}

interface Progress {
  id: number;
  user_id: number;
  lesson_id: number;
  completed_at: string;
}

interface QuizResult {
  id: number;
  user_id: number;
  course_id: number;
  score: number;
  total_questions: number;
  created_at: string;
}

const dbPath = path.join(process.cwd(), 'learnkart.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
      instructor TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Lessons table
  db.exec(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
    )
  `);

  // Enrollments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, course_id),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
    )
  `);

  // Progress table
  db.exec(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
    )
  `);

  // Quiz results table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
    )
  `);
};

// Seed data
const seedData = () => {
  const checkCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
  
  if (checkCourses.count > 0) {
    return; // Data already seeded
  }

  // Insert courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (title, description, level, instructor, image_url) 
    VALUES (?, ?, ?, ?, ?)
  `);

  const courses = [
    {
      title: "Introduction to Python Programming",
      description: "Learn Python programming from basics to advanced concepts. Perfect for beginners who want to start their programming journey.",
      level: "Beginner",
      instructor: "Dr. Sarah Johnson",
      image_url: "/api/placeholder/400/200"
    },
    {
      title: "Web Development with React",
      description: "Master modern web development with React, hooks, and state management. Build interactive user interfaces.",
      level: "Intermediate",
      instructor: "Mark Rodriguez",
      image_url: "/api/placeholder/400/200"
    },
    {
      title: "Machine Learning Fundamentals",
      description: "Dive into machine learning algorithms, data preprocessing, and model evaluation using Python and scikit-learn.",
      level: "Advanced",
      instructor: "Prof. Emily Chen",
      image_url: "/api/placeholder/400/200"
    },
    {
      title: "Data Science with Pandas",
      description: "Master data manipulation and analysis using Pandas library. Learn to work with real-world datasets.",
      level: "Intermediate",
      instructor: "Alex Kumar",
      image_url: "/api/placeholder/400/200"
    }
  ];

  courses.forEach(course => {
    insertCourse.run(course.title, course.description, course.level, course.instructor, course.image_url);
  });

  // Insert lessons for each course
  const insertLesson = db.prepare(`
    INSERT INTO lessons (course_id, title, content, order_index, duration_minutes) 
    VALUES (?, ?, ?, ?, ?)
  `);

  const lessons = [
    // Python Programming Course (ID: 1)
    {
      course_id: 1,
      title: "Getting Started with Python",
      content: "Python is a versatile, high-level programming language known for its simplicity and readability. In this lesson, you'll learn about Python's history, its applications in various fields like web development, data science, and automation. We'll cover how to install Python on your system, set up your development environment, and write your first Python program. You'll understand Python's philosophy of clean, readable code and explore the interactive Python interpreter (REPL) for quick experimentation.",
      order_index: 1,
      duration_minutes: 45
    },
    {
      course_id: 1,
      title: "Variables and Data Types",
      content: "Understanding data types is fundamental to programming in Python. This lesson covers Python's built-in data types including integers, floats, strings, booleans, lists, tuples, dictionaries, and sets. You'll learn how Python handles dynamic typing, variable assignment, and type conversion. We'll explore string manipulation, list operations, dictionary methods, and when to use each data type effectively. Practice exercises include creating variables, performing type conversions, and manipulating different data structures.",
      order_index: 2,
      duration_minutes: 60
    },
    {
      course_id: 1,
      title: "Control Structures and Loops",
      content: "Control structures determine the flow of program execution. This lesson covers conditional statements (if, elif, else), comparison and logical operators, and different types of loops (for, while). You'll learn about loop control statements like break and continue, nested loops, and list comprehensions for more pythonic code. We'll practice with real-world scenarios like processing user input, validating data, and iterating through collections. Understanding control flow is essential for writing logical, efficient programs.",
      order_index: 3,
      duration_minutes: 55
    },
    {
      course_id: 1,
      title: "Functions and Modules",
      content: "Functions are reusable blocks of code that perform specific tasks, making your programs more organized and maintainable. This lesson covers function definition and calling, parameters and arguments, return values, and variable scope. You'll learn about lambda functions, built-in functions, and how to import and use modules. We'll explore the Python Standard Library, create custom modules, and understand the importance of code organization. Practice includes writing utility functions and creating your own module.",
      order_index: 4,
      duration_minutes: 70
    },
    {
      course_id: 1,
      title: "File Handling and Error Management",
      content: "Working with files and handling errors gracefully are crucial skills for any programmer. This lesson covers reading from and writing to files, different file modes, and the 'with' statement for proper resource management. You'll learn about exception handling using try-except blocks, raising custom exceptions, and debugging techniques. We'll practice reading CSV files, processing text data, handling common errors like FileNotFoundError and ValueError, and writing robust programs that handle unexpected situations.",
      order_index: 5,
      duration_minutes: 65
    },

    // React Development Course (ID: 2)
    {
      course_id: 2,
      title: "React Fundamentals and JSX",
      content: "React is a powerful JavaScript library for building user interfaces, developed by Facebook. This lesson introduces React's component-based architecture, virtual DOM, and the declarative programming paradigm. You'll learn about JSX syntax, which allows you to write HTML-like code in JavaScript, and understand how React compiles JSX into JavaScript. We'll set up a React development environment using Create React App, explore the project structure, and create your first React components. Understanding these fundamentals is crucial for building modern web applications.",
      order_index: 1,
      duration_minutes: 50
    },
    {
      course_id: 2,
      title: "Components and Props",
      content: "Components are the building blocks of React applications. This lesson covers functional and class components, component composition, and the props system for passing data between components. You'll learn about prop validation using PropTypes, default props, and component reusability. We'll explore best practices for component design, including the single responsibility principle and component hierarchies. Practice exercises include creating reusable UI components, passing data through props, and building a component library for your applications.",
      order_index: 2,
      duration_minutes: 65
    },
    {
      course_id: 2,
      title: "State Management with Hooks",
      content: "State management is central to building interactive React applications. This lesson covers the useState hook for managing local component state, useEffect for side effects and lifecycle events, and other built-in hooks like useContext and useReducer. You'll learn about state immutability, controlled vs uncontrolled components, and event handling. We'll build interactive forms, implement data fetching, and manage complex state scenarios. Understanding hooks is essential for modern React development.",
      order_index: 3,
      duration_minutes: 75
    },
    {
      course_id: 2,
      title: "Routing and Navigation",
      content: "Single-page applications need routing to navigate between different views. This lesson covers React Router, the most popular routing solution for React applications. You'll learn about BrowserRouter, Route components, navigation with Link and NavLink, programmatic navigation using useNavigate, and route parameters. We'll implement protected routes, nested routing, and dynamic route matching. Practice includes building a multi-page application with navigation, handling 404 errors, and implementing authentication-based routing.",
      order_index: 4,
      duration_minutes: 60
    },
    {
      course_id: 2,
      title: "API Integration and Data Fetching",
      content: "Modern web applications communicate with servers through APIs. This lesson covers making HTTP requests using fetch and axios, handling asynchronous operations with async/await, and managing loading and error states. You'll learn about RESTful APIs, handling different HTTP methods, and implementing CRUD operations. We'll explore data fetching patterns, caching strategies, and error handling. Practice includes connecting to real APIs, displaying dynamic data, and implementing features like search and pagination.",
      order_index: 5,
      duration_minutes: 80
    },

    // Machine Learning Course (ID: 3)
    {
      course_id: 3,
      title: "Introduction to Machine Learning",
      content: "Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without explicit programming. This lesson covers the fundamental concepts of ML, including supervised, unsupervised, and reinforcement learning paradigms. You'll understand the difference between classification and regression problems, explore real-world applications across industries, and learn about the typical ML workflow from data collection to model deployment. We'll discuss the importance of data quality, feature engineering, and the ethical considerations in ML development.",
      order_index: 1,
      duration_minutes: 55
    },
    {
      course_id: 3,
      title: "Data Preprocessing and Feature Engineering",
      content: "Quality data is the foundation of successful machine learning models. This lesson covers essential data preprocessing techniques including handling missing values, outlier detection and treatment, data normalization and standardization, and categorical variable encoding. You'll learn about feature selection methods, dimensionality reduction techniques like PCA, and creating new features from existing data. We'll use Python libraries like pandas and scikit-learn to clean and prepare datasets for machine learning algorithms. Proper preprocessing can significantly improve model performance.",
      order_index: 2,
      duration_minutes: 70
    },
    {
      course_id: 3,
      title: "Supervised Learning Algorithms",
      content: "Supervised learning algorithms learn from labeled training data to make predictions on new, unseen data. This lesson covers popular algorithms including linear and logistic regression, decision trees, random forests, and support vector machines. You'll understand when to use each algorithm, their strengths and weaknesses, and how to implement them using scikit-learn. We'll explore hyperparameter tuning, cross-validation for model selection, and techniques to prevent overfitting. Practice includes building classification and regression models on real datasets.",
      order_index: 3,
      duration_minutes: 85
    },
    {
      course_id: 3,
      title: "Model Evaluation and Validation",
      content: "Evaluating machine learning models correctly is crucial for building reliable systems. This lesson covers various evaluation metrics for classification (accuracy, precision, recall, F1-score, ROC-AUC) and regression (MSE, MAE, R-squared) problems. You'll learn about train-validation-test splits, k-fold cross-validation, and techniques for handling imbalanced datasets. We'll explore bias-variance tradeoff, learning curves, and model interpretation methods. Understanding these concepts helps you build models that generalize well to new data and avoid common pitfalls.",
      order_index: 4,
      duration_minutes: 75
    },
    {
      course_id: 3,
      title: "Unsupervised Learning and Clustering",
      content: "Unsupervised learning discovers hidden patterns in data without labeled examples. This lesson covers clustering algorithms like K-means, hierarchical clustering, and DBSCAN for grouping similar data points. You'll learn about dimensionality reduction techniques including PCA and t-SNE for data visualization and feature reduction. We'll explore association rule mining for market basket analysis and anomaly detection for identifying outliers. Practice includes customer segmentation, recommendation systems, and data exploration using unsupervised techniques.",
      order_index: 5,
      duration_minutes: 80
    },

    // Data Science with Pandas Course (ID: 4)
    {
      course_id: 4,
      title: "Getting Started with Pandas",
      content: "Pandas is the most popular Python library for data manipulation and analysis, built on top of NumPy. This lesson introduces the core Pandas data structures: Series (1-dimensional) and DataFrame (2-dimensional), and their key features. You'll learn how to create DataFrames from various sources including CSV files, Excel spreadsheets, JSON data, and databases. We'll explore the Pandas ecosystem, understand the relationship with NumPy, and set up your data analysis environment. Understanding these fundamentals is essential for effective data manipulation.",
      order_index: 1,
      duration_minutes: 45
    },
    {
      course_id: 4,
      title: "Data Selection and Indexing",
      content: "Efficiently selecting and indexing data is fundamental to data analysis with Pandas. This lesson covers various methods to access data including label-based indexing with .loc, position-based indexing with .iloc, and Boolean indexing for filtering data. You'll learn about multi-level indexing (MultiIndex), setting and resetting indexes, and advanced selection techniques. We'll practice selecting specific rows and columns, filtering data based on conditions, and working with time series data. Mastering these techniques enables efficient data exploration and analysis.",
      order_index: 2,
      duration_minutes: 60
    },
    {
      course_id: 4,
      title: "Data Cleaning and Transformation",
      content: "Real-world data is often messy and requires cleaning before analysis. This lesson covers handling missing data using methods like dropna(), fillna(), and interpolation techniques. You'll learn about data type conversions, removing duplicates, and dealing with inconsistent data formats. We'll explore string manipulation methods for text data, date/time parsing and manipulation, and reshaping data using pivot tables, melting, and stacking operations. These skills are essential for preparing data for analysis and ensuring data quality.",
      order_index: 3,
      duration_minutes: 70
    },
    {
      course_id: 4,
      title: "Grouping and Aggregation",
      content: "Grouping and aggregation operations allow you to summarize and analyze data by categories. This lesson covers the powerful groupby operation for splitting data into groups, applying functions, and combining results. You'll learn about various aggregation functions (sum, mean, count, etc.), custom aggregation functions, and multiple aggregations simultaneously. We'll explore pivot tables for cross-tabulation analysis, time-based grouping for temporal data analysis, and window functions for rolling calculations. These techniques are crucial for data summarization and business intelligence.",
      order_index: 4,
      duration_minutes: 65
    },
    {
      course_id: 4,
      title: "Merging and Joining Data",
      content: "Combining data from multiple sources is a common requirement in data analysis. This lesson covers different ways to combine DataFrames including merge operations (inner, outer, left, right joins), concatenation for stacking data vertically or horizontally, and joining on indexes. You'll learn about handling duplicate keys, dealing with missing values in joins, and performance considerations for large datasets. We'll practice combining datasets from different sources, creating master datasets for analysis, and understanding the SQL-like operations in Pandas. These skills are essential for comprehensive data analysis workflows.",
      order_index: 5,
      duration_minutes: 75
    }
  ];

  lessons.forEach(lesson => {
    insertLesson.run(lesson.course_id, lesson.title, lesson.content, lesson.order_index, lesson.duration_minutes);
  });
};

// Initialize database
createTables();
seedData();

// Database interface functions
export const getDB = () => db;

export const getUserByEmail = (email: string): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | undefined;
};

export const createUser = async (name: string, email: string, password: string): Promise<number> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const stmt = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
  const result = stmt.run(name, email, hashedPassword);
  return result.lastInsertRowid as number;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const getAllCourses = (): (Course & { lesson_count: number; enrollment_count: number })[] => {
  const stmt = db.prepare(`
    SELECT 
      c.*,
      COUNT(DISTINCT l.id) as lesson_count,
      COUNT(DISTINCT e.id) as enrollment_count
    FROM courses c
    LEFT JOIN lessons l ON c.id = l.course_id
    LEFT JOIN enrollments e ON c.id = e.course_id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `);
  return stmt.all() as (Course & { lesson_count: number; enrollment_count: number })[];
};

export const getCourseById = (courseId: number): (Course & { lesson_count: number }) | undefined => {
  const stmt = db.prepare(`
    SELECT 
      c.*,
      COUNT(l.id) as lesson_count
    FROM courses c
    LEFT JOIN lessons l ON c.id = l.course_id
    WHERE c.id = ?
    GROUP BY c.id
  `);
  return stmt.get(courseId) as (Course & { lesson_count: number }) | undefined;
};

export const getLessonsByCourseId = (courseId: number): Lesson[] => {
  const stmt = db.prepare('SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index');
  return stmt.all(courseId) as Lesson[];
};

export const getLessonById = (lessonId: number): Lesson | undefined => {
  const stmt = db.prepare('SELECT * FROM lessons WHERE id = ?');
  return stmt.get(lessonId) as Lesson | undefined;
};

export const enrollUserInCourse = (userId: number, courseId: number): boolean => {
  try {
    const stmt = db.prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)');
    stmt.run(userId, courseId);
    return true;
  } catch (error) {
    return false; // Already enrolled or other error
  }
};

export const getUserEnrollments = (userId: number) => {
  const stmt = db.prepare(`
    SELECT 
      c.*,
      e.enrolled_at,
      COUNT(DISTINCT l.id) as total_lessons,
      COUNT(DISTINCT p.lesson_id) as completed_lessons
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    LEFT JOIN lessons l ON c.id = l.course_id
    LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = e.user_id
    WHERE e.user_id = ?
    GROUP BY c.id, e.enrolled_at
    ORDER BY e.enrolled_at DESC
  `);
  return stmt.all(userId);
};

export const markLessonComplete = (userId: number, lessonId: number): boolean => {
  try {
    const stmt = db.prepare('INSERT INTO progress (user_id, lesson_id) VALUES (?, ?)');
    stmt.run(userId, lessonId);
    return true;
  } catch (error) {
    return false; // Already completed or other error
  }
};

export const getUserProgress = (userId: number, courseId?: number) => {
  let query = `
    SELECT 
      l.id as lesson_id,
      l.course_id,
      l.title as lesson_title,
      c.title as course_title,
      p.completed_at
    FROM lessons l
    JOIN courses c ON l.course_id = c.id
    LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ?
  `;
  
  const params = [userId];
  
  if (courseId) {
    query += ' WHERE l.course_id = ?';
    params.push(courseId);
  }
  
  query += ' ORDER BY l.course_id, l.order_index';
  
  const stmt = db.prepare(query);
  return stmt.all(...params);
};

export const saveQuizResult = (userId: number, courseId: number, score: number, totalQuestions: number): boolean => {
  try {
    const stmt = db.prepare('INSERT INTO quiz_results (user_id, course_id, score, total_questions) VALUES (?, ?, ?, ?)');
    stmt.run(userId, courseId, score, totalQuestions);
    return true;
  } catch (error) {
    return false;
  }
};

export const isUserEnrolled = (userId: number, courseId: number): boolean => {
  const stmt = db.prepare('SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ?');
  return !!stmt.get(userId, courseId);
};