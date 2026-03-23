import { coursesWithVideos, getCourseBySlug, getCourseById, getVideoById } from '../data/videoData.js';

// Mock API delay for realistic experience
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for additional course listing
const additionalMockData = {
  featuredCourses: coursesWithVideos.slice(0, 6),
  allCourses: coursesWithVideos,
  categories: [
    { id: 1, name: 'Web Development', slug: 'web-development', count: 45 },
    { id: 2, name: 'JavaScript', slug: 'javascript', count: 30 },
    { id: 3, name: 'React', slug: 'react', count: 25 },
    { id: 4, name: 'Backend', slug: 'backend', count: 20 },
    { id: 5, name: 'Full Stack', slug: 'fullstack', count: 18 },
    { id: 6, name: 'Mobile Development', slug: 'mobile', count: 15 },
    { id: 7, name: 'DevOps', slug: 'devops', count: 12 },
    { id: 8, name: 'Cloud Computing', slug: 'cloud', count: 10 },
    { id: 9, name: 'Testing', slug: 'testing', count: 8 }
  ]
};

// Enhanced courses API with video integration
export const coursesAPI = {
  getAll: async (params = {}) => {
    await delay(300);

    const { category, search, limit = 20, page = 1 } = params;
    let filteredCourses = [...coursesWithVideos];

    // Filter by category
    if (category && category !== 'all') {
      filteredCourses = filteredCourses.filter(
        course => course.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by search
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        course =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          course.category.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + limit);

    return {
      data: {
        data: {
          courses: paginatedCourses,
          totalCourses: filteredCourses.length,
          totalPages: Math.ceil(filteredCourses.length / limit),
          currentPage: page,
          hasNext: page * limit < filteredCourses.length,
          hasPrev: page > 1
        }
      }
    };
  },

  getById: async (courseId) => {
    await delay(200);
    const course = getCourseById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    return {
      data: {
        data: {
          course: {
            ...course,
            // Add additional course details
            whatYouLearn: [
              'Build modern, responsive web applications',
              'Master advanced programming patterns',
              'Create stunning user interfaces',
              'Implement secure authentication systems',
              'Deploy applications to production',
              'Best practices for code organization'
            ],
            requirements: [
              'Basic understanding of programming concepts',
              'Computer with internet connection',
              'Willingness to learn and practice'
            ],
            targetAudience: [
              'Beginner developers',
              'Students looking to upgrade skills',
              'Professionals switching careers',
              'Anyone interested in web development'
            ]
          }
        }
      }
    };
  },

  getBySlug: async (slug) => {
    await delay(200);
    const course = getCourseBySlug(slug);

    if (!course) {
      throw new Error('Course not found');
    }

    return {
      data: {
        data: {
          course: {
            ...course,
            whatYouLearn: [
              'Build modern, responsive applications',
              'Master advanced programming techniques',
              'Create production-ready projects',
              'Implement best practices and patterns',
              'Deploy and maintain applications',
              'Develop problem-solving skills'
            ],
            requirements: [
              'Basic programming knowledge',
              'Computer with development environment',
              'Enthusiastic attitude to learn'
            ],
            targetAudience: [
              'Aspiring developers',
              'Students and professionals',
              'Career changers',
              'Skill upgraders'
            ]
          }
        }
      }
    };
  },

  getFeatured: async () => {
    await delay(250);
    return {
      data: {
        data: {
          courses: additionalMockData.featuredCourses
        }
      }
    };
  },

  getCategories: async () => {
    await delay(100);
    return {
      data: {
        data: {
          categories: additionalMockData.categories
        }
      }
    };
  }
};

// Video/Lessons API
export const lessonsAPI = {
  getByCourse: async (courseId) => {
    await delay(200);
    const course = getCourseById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    return {
      data: {
        data: {
          lessons: course.videos.map(video => ({
            ...video,
            courseId,
            completed: false,
            watchTime: 0
          }))
        }
      }
    };
  },

  getById: async (lessonId) => {
    await delay(150);
    const video = getVideoById(lessonId);

    if (!video) {
      throw new Error('Lesson not found');
    }

    return {
      data: {
        data: {
          lesson: {
            ...video,
            completed: false,
            watchTime: 0,
            transcript: null,
            resources: []
          }
        }
      }
    };
  },

  markComplete: async (lessonId) => {
    await delay(100);
    // In a real app, this would update the database
    console.log(`Marked lesson ${lessonId} as complete`);

    return {
      data: {
        data: {
          success: true,
          message: 'Lesson marked as complete'
        }
      }
    };
  },

  updateProgress: async (lessonId, progress) => {
    await delay(100);
    // In a real app, this would update the progress in the database
    console.log(`Updated lesson ${lessonId} progress to ${progress}%`);

    return {
      data: {
        data: {
          success: true,
          progress
        }
      }
    };
  }
};

// Enhanced enrollments API with video support
export const enrollmentsAPI = {
  enroll: async (courseId) => {
    await delay(500);
    const course = getCourseById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    // Mock enrollment success
    console.log(`Enrolled in course: ${course.title}`);

    return {
      data: {
        data: {
          enrollment: {
            id: `enroll_${Date.now()}`,
            courseId,
            userId: 'current_user',
            enrolledAt: new Date().toISOString(),
            status: 'active',
            progress: 0,
            accessLevel: 'full'
          }
        }
      }
    };
  },

  check: async (courseId) => {
    await delay(100);
    // Mock enrollment check - in real app, check user's enrollments
    return {
      data: {
        enrolled: true, // Always return true for demo
        progress: Math.floor(Math.random() * 100),
        completedLessons: Math.floor(Math.random() * 5)
      }
    };
  },

  getAll: async () => {
    await delay(300);
    return {
      data: {
        data: {
          enrollments: coursesWithVideos.slice(0, 3).map((course, index) => ({
            id: `enroll_${index + 1}`,
            courseId: course.id,
            course,
            progress: Math.floor(Math.random() * 100),
            enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            completedLessons: Math.floor(Math.random() * course.totalLessons),
            totalLessons: course.totalLessons
          }))
        }
      }
    };
  }
};

// Keep existing APIs for compatibility
export const authAPI = {
  login: async (credentials) => {
    await delay(1000);

    // Mock successful login
    return {
      data: {
        data: {
          user: {
            id: 'user_123',
            name: 'John Doe',
            email: credentials.email,
            role: 'STUDENT',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
          },
          accessToken: 'mock_token_' + Date.now()
        }
      }
    };
  },

  register: async (userData) => {
    await delay(1200);

    return {
      data: {
        data: {
          user: {
            id: 'user_' + Date.now(),
            name: userData.name,
            email: userData.email,
            role: userData.role || 'STUDENT',
            avatar: null
          },
          accessToken: 'mock_token_' + Date.now()
        }
      }
    };
  },

  me: async () => {
    await delay(200);

    return {
      data: {
        data: {
          id: 'user_123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'STUDENT',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
        }
      }
    };
  },

  logout: async () => {
    await delay(300);
    return { data: { success: true } };
  }
};