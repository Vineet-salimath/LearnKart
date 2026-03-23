// Complete course data with sections and lessons for all 30 courses
export const COURSES_WITH_CONTENT = [
  {
    id: 1,
    title: 'React Full Course',
    author: 'Traversy Media',
    cat: 'React/Next/TS',
    lvl: 'Beginner',
    price: 199,
    rating: 4.8,
    students: '32K',
    ytId: 'bMknfKXIFA8',
    duration: '12 hours',
    sections: [
      {
        id: 1,
        title: 'Introduction to React',
        lessons: [
          { id: 1, title: 'What is React?', duration: '5:23', videoUrl: 'bMknfKXIFA8' },
          { id: 2, title: 'Setting up Environment', duration: '10:15', videoUrl: 'bMknfKXIFA8' },
          { id: 3, title: 'Create React App', duration: '8:45', videoUrl: 'bMknfKXIFA8' },
        ]
      },
      {
        id: 2,
        title: 'React Fundamentals',
        lessons: [
          { id: 4, title: 'Components & JSX', duration: '15:42', videoUrl: 'bMknfKXIFA8' },
          { id: 5, title: 'Props & State', duration: '12:30', videoUrl: 'bMknfKXIFA8' },
          { id: 6, title: 'Hooks Introduction', duration: '18:20', videoUrl: 'bMknfKXIFA8' },
          { id: 7, title: 'Event Handling', duration: '10:10', videoUrl: 'bMknfKXIFA8' },
        ]
      },
      {
        id: 3,
        title: 'Advanced Concepts',
        lessons: [
          { id: 8, title: 'Context API', duration: '14:55', videoUrl: 'bMknfKXIFA8' },
          { id: 9, title: 'Custom Hooks', duration: '16:10', videoUrl: 'bMknfKXIFA8' },
          { id: 10, title: 'React Router', duration: '20:30', videoUrl: 'bMknfKXIFA8' },
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Next.js Full Course',
    author: 'Vercel Team',
    cat: 'React/Next/TS',
    lvl: 'Intermediate',
    price: 299,
    rating: 4.7,
    students: '18K',
    ytId: 'wm5gMKuwSYk',
    duration: '15 hours',
    sections: [
      {
        id: 1,
        title: 'Getting Started with Next.js',
        lessons: [
          { id: 1, title: 'Introduction to Next.js', duration: '8:15', videoUrl: 'wm5gMKuwSYk' },
          { id: 2, title: 'Pages & Routing', duration: '12:30', videoUrl: 'wm5gMKuwSYk' },
          { id: 3, title: 'API Routes', duration: '14:20', videoUrl: 'wm5gMKuwSYk' },
        ]
      },
      {
        id: 2,
        title: 'Data Fetching',
        lessons: [
          { id: 4, title: 'getStaticProps', duration: '16:45', videoUrl: 'wm5gMKuwSYk' },
          { id: 5, title: 'getServerSideProps', duration: '14:30', videoUrl: 'wm5gMKuwSYk' },
          { id: 6, title: 'ISR & Revalidation', duration: '18:10', videoUrl: 'wm5gMKuwSYk' },
        ]
      },
      {
        id: 3,
        title: 'Advanced Features',
        lessons: [
          { id: 7, title: 'Image Optimization', duration: '12:25', videoUrl: 'wm5gMKuwSYk' },
          { id: 8, title: 'Middleware', duration: '15:40', videoUrl: 'wm5gMKuwSYk' },
          { id: 9, title: 'Deployment', duration: '11:20', videoUrl: 'wm5gMKuwSYk' },
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'TypeScript Course',
    author: 'Matt Pocock',
    cat: 'React/Next/TS',
    lvl: 'Intermediate',
    price: 249,
    rating: 4.6,
    students: '14K',
    ytId: '30LWjhZzg50',
    duration: '10 hours',
    sections: [
      {
        id: 1,
        title: 'TypeScript Basics',
        lessons: [
          { id: 1, title: 'Types and Interfaces', duration: '10:30', videoUrl: '30LWjhZzg50' },
          { id: 2, title: 'Functions & Generics', duration: '14:15', videoUrl: '30LWjhZzg50' },
          { id: 3, title: 'Union & Intersection Types', duration: '12:45', videoUrl: '30LWjhZzg50' },
        ]
      },
      {
        id: 2,
        title: 'Advanced TypeScript',
        lessons: [
          { id: 4, title: 'Conditional Types', duration: '16:20', videoUrl: '30LWjhZzg50' },
          { id: 5, title: 'Mapped Types', duration: '15:10', videoUrl: '30LWjhZzg50' },
          { id: 6, title: 'Utility Types', duration: '13:30', videoUrl: '30LWjhZzg50' },
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'JavaScript Full Course',
    author: 'FreeCodeCamp',
    cat: 'JavaScript',
    lvl: 'Beginner',
    price: 0,
    rating: 4.9,
    students: '95K',
    ytId: 'PkZNo7MFNFg',
    duration: '8 hours',
    sections: [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        lessons: [
          { id: 1, title: 'Variables & Data Types', duration: '8:20', videoUrl: 'PkZNo7MFNFg' },
          { id: 2, title: 'Operators & Expressions', duration: '10:45', videoUrl: 'PkZNo7MFNFg' },
          { id: 3, title: 'Control Flow', duration: '12:30', videoUrl: 'PkZNo7MFNFg' },
          { id: 4, title: 'Functions', duration: '15:10', videoUrl: 'PkZNo7MFNFg' },
        ]
      },
      {
        id: 2,
        title: 'Working with Data',
        lessons: [
          { id: 5, title: 'Arrays', duration: '14:25', videoUrl: 'PkZNo7MFNFg' },
          { id: 6, title: 'Objects', duration: '16:40', videoUrl: 'PkZNo7MFNFg' },
          { id: 7, title: 'JSON', duration: '9:15', videoUrl: 'PkZNo7MFNFg' },
        ]
      },
      {
        id: 3,
        title: 'Advanced Topics',
        lessons: [
          { id: 8, title: 'Promises & Async/Await', duration: '18:30', videoUrl: 'PkZNo7MFNFg' },
          { id: 9, title: 'ES6+ Features', duration: '20:15', videoUrl: 'PkZNo7MFNFg' },
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Advanced JavaScript',
    author: 'Akshay Saini',
    cat: 'JavaScript',
    lvl: 'Advanced',
    price: 349,
    rating: 4.9,
    students: '41K',
    ytId: 'KGkiIBTq0y0',
    duration: '20 hours',
    sections: [
      {
        id: 1,
        title: 'Deep Dive into JavaScript',
        lessons: [
          { id: 1, title: 'Execution Context', duration: '22:15', videoUrl: 'KGkiIBTq0y0' },
          { id: 2, title: 'Hoisting', duration: '18:30', videoUrl: 'KGkiIBTq0y0' },
          { id: 3, title: 'Closures', duration: '25:45', videoUrl: 'KGkiIBTq0y0' },
        ]
      },
      {
        id: 2,
        title: 'Asynchronous JavaScript',
        lessons: [
          { id: 4, title: 'Event Loop', duration: '28:20', videoUrl: 'KGkiIBTq0y0' },
          { id: 5, title: 'Callbacks', duration: '16:10', videoUrl: 'KGkiIBTq0y0' },
          { id: 6, title: 'Promise Internals', duration: '24:35', videoUrl: 'KGkiIBTq0y0' },
        ]
      }
    ]
  },
  // Adding abbreviated data for remaining courses to save space
  ...Array.from({ length: 25 }, (_, i) => {
    const courseId = i + 6;
    const courses = [
      { id: 6, title: 'JS Crash Course', author: 'Traversy Media', cat: 'JavaScript', lvl: 'Beginner', price: 99, rating: 4.5, students: '28K', ytId: 'hdI2bqOjy3c', duration: '6 hours' },
      { id: 7, title: 'Ethical Hacking Full Course', author: 'TCM Security', cat: 'Cybersecurity', lvl: 'Beginner', price: 399, rating: 4.8, students: '22K', ytId: '3Kq1MIfTWCE', duration: '25 hours' },
      { id: 8, title: 'Web Security Fundamentals', author: 'TCM Security', cat: 'Cybersecurity', lvl: 'Intermediate', price: 299, rating: 4.6, students: '11K', ytId: '3Kq1MIfTWCE', duration: '18 hours' },
      { id: 9, title: 'Bug Bounty Guide', author: 'InsiderPhD', cat: 'Cybersecurity', lvl: 'Intermediate', price: 449, rating: 4.7, students: '8K', ytId: 'Pu3gk9K5cZ8', duration: '22 hours' },
      { id: 10, title: 'Practical Ethical Hacking', author: 'Heath Adams', cat: 'Cybersecurity', lvl: 'Advanced', price: 499, rating: 4.9, students: '19K', ytId: 'fNzpcB7ODxQ', duration: '30 hours' },
      { id: 11, title: 'HackTheBox Walkthrough', author: 'IppSec', cat: 'Cybersecurity', lvl: 'Advanced', price: 349, rating: 4.8, students: '7K', ytId: '2eLe7uz-7CM', duration: '16 hours' },
      { id: 12, title: 'Docker Full Course', author: 'TechWorld Nina', cat: 'DevOps', lvl: 'Beginner', price: 199, rating: 4.7, students: '33K', ytId: 'fqMOX6JJhGo', duration: '12 hours' },
      { id: 13, title: 'Kubernetes Full Course', author: 'TechWorld Nina', cat: 'DevOps', lvl: 'Intermediate', price: 349, rating: 4.8, students: '25K', ytId: 'X48VuDVv0do', duration: '20 hours' },
      { id: 14, title: 'Jenkins CI/CD', author: 'Simplilearn', cat: 'DevOps', lvl: 'Intermediate', price: 249, rating: 4.5, students: '12K', ytId: 'FX322RVNGj4', duration: '14 hours' },
      { id: 15, title: 'DevOps Roadmap', author: 'TechWorld', cat: 'DevOps', lvl: 'Beginner', price: 0, rating: 4.6, students: '44K', ytId: '9pZ2xmsSDdo', duration: '8 hours' },
      { id: 16, title: 'Linux for Beginners', author: 'DorianDotSlash', cat: 'DevOps', lvl: 'Beginner', price: 149, rating: 4.7, students: '38K', ytId: 'ivd3b6z2d4k', duration: '10 hours' },
      { id: 17, title: 'Mobile App Security Android', author: 'STÖK', cat: 'Mobile Security', lvl: 'Intermediate', price: 399, rating: 4.6, students: '6K', ytId: 'HhF0X9cXH6E', duration: '18 hours' },
      { id: 18, title: 'OWASP Top 10 AppSec', author: 'TCM Security', cat: 'Mobile Security', lvl: 'Advanced', price: 449, rating: 4.8, students: '9K', ytId: '3Kq1MIfTWCE', duration: '20 hours' },
      { id: 19, title: 'System Design Basics', author: 'Gaurav Sen', cat: 'System Design', lvl: 'Intermediate', price: 299, rating: 4.9, students: '52K', ytId: 'UzLMhqg3_Wc', duration: '16 hours' },
      { id: 20, title: 'Microservices Architecture', author: 'Tech Primers', cat: 'System Design', lvl: 'Advanced', price: 399, rating: 4.7, students: '16K', ytId: 'rv4LlmLmVWk', duration: '18 hours' },
      { id: 21, title: 'Node.js Full Course', author: 'FreeCodeCamp', cat: 'Backend', lvl: 'Beginner', price: 0, rating: 4.8, students: '67K', ytId: 'Oe421EPjeBE', duration: '12 hours' },
      { id: 22, title: 'SQL Full Course', author: 'FreeCodeCamp', cat: 'Database', lvl: 'Beginner', price: 0, rating: 4.9, students: '88K', ytId: 'HXV3zeQKqGY', duration: '8 hours' },
      { id: 23, title: 'PostgreSQL Complete', author: 'Amigoscode', cat: 'Database', lvl: 'Intermediate', price: 249, rating: 4.7, students: '21K', ytId: 'qw--VYLpxG4', duration: '14 hours' },
      { id: 24, title: 'MongoDB Full Course', author: 'FreeCodeCamp', cat: 'Database', lvl: 'Beginner', price: 149, rating: 4.6, students: '29K', ytId: 'ofme2o29ngU', duration: '10 hours' },
      { id: 25, title: 'Python Full Course', author: 'FreeCodeCamp', cat: 'Python', lvl: 'Beginner', price: 0, rating: 4.9, students: '112K', ytId: 'rfscVS0vtbw', duration: '10 hours' },
      { id: 26, title: 'Python OOP', author: 'Corey Schafer', cat: 'Python', lvl: 'Intermediate', price: 199, rating: 4.8, students: '34K', ytId: 'JeznW_7DlB0', duration: '12 hours' },
      { id: 27, title: 'Python Projects', author: 'Tech With Tim', cat: 'Python', lvl: 'Intermediate', price: 249, rating: 4.7, students: '27K', ytId: '8ext9G7xspg', duration: '15 hours' },
      { id: 28, title: 'Automation with Python', author: 'FreeCodeCamp', cat: 'Python', lvl: 'Advanced', price: 299, rating: 4.6, students: '19K', ytId: 'PXMJ6FS7llk', duration: '18 hours' },
      { id: 29, title: 'CI/CD Advanced Pipeline', author: 'DevOps Directive', cat: 'Extra', lvl: 'Advanced', price: 349, rating: 4.7, students: '8K', ytId: 'scEDHsr3APg', duration: '16 hours' },
      { id: 30, title: 'Advanced Web Dev Project', author: 'Traversy Media', cat: 'Extra', lvl: 'Advanced', price: 399, rating: 4.8, students: '11K', ytId: 'Ke90Tje7VS0', duration: '20 hours' },
    ];

    const course = courses[i];
    if (!course) return null;

    return {
      ...course,
      sections: [
        {
          id: 1,
          title: 'Introduction',
          lessons: [
            { id: 1, title: 'Getting Started', duration: '10:30', videoUrl: course.ytId },
            { id: 2, title: 'Core Concepts', duration: '15:20', videoUrl: course.ytId },
            { id: 3, title: 'Project Setup', duration: '12:45', videoUrl: course.ytId },
          ]
        },
        {
          id: 2,
          title: 'Intermediate Topics',
          lessons: [
            { id: 4, title: 'Advanced Techniques', duration: '18:10', videoUrl: course.ytId },
            { id: 5, title: 'Best Practices', duration: '14:30', videoUrl: course.ytId },
            { id: 6, title: 'Common Patterns', duration: '16:20', videoUrl: course.ytId },
          ]
        },
        {
          id: 3,
          title: 'Advanced & Projects',
          lessons: [
            { id: 7, title: 'Real-World Project', duration: '25:40', videoUrl: course.ytId },
            { id: 8, title: 'Deployment', duration: '11:15', videoUrl: course.ytId },
            { id: 9, title: 'Final Thoughts', duration: '8:30', videoUrl: course.ytId },
          ]
        }
      ]
    };
  }).filter(Boolean)
];

export default COURSES_WITH_CONTENT;
