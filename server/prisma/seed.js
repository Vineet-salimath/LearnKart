import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const db = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    await db.progress.deleteMany();
    await db.enrollment.deleteMany();
    await db.lesson.deleteMany();
    await db.section.deleteMany();
    await db.orderItem.deleteMany();
    await db.order.deleteMany();
    await db.refreshToken.deleteMany();
    await db.coupon.deleteMany();
    await db.course.deleteMany();
    await db.user.deleteMany();

    // Create users
    const adminPassword = await bcrypt.hash('Password123!', 12);
    const instructorPassword = await bcrypt.hash('Password123!', 12);
    const studentPassword = await bcrypt.hash('Password123!', 12);

    const admin = await db.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@lms.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    });

    const instructor1 = await db.user.create({
      data: {
        name: 'John Doe',
        email: 'instructor1@lms.com',
        password: instructorPassword,
        role: 'INSTRUCTOR',
        bio: 'Expert in web development with 10+ years experience'
      }
    });

    const instructor2 = await db.user.create({
      data: {
        name: 'Jane Smith',
        email: 'instructor2@lms.com',
        password: instructorPassword,
        role: 'INSTRUCTOR',
        bio: 'Data Science specialist'
      }
    });

    const student1 = await db.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'student1@lms.com',
        password: studentPassword,
        role: 'STUDENT'
      }
    });

    const student2 = await db.user.create({
      data: {
        name: 'Bob Wilson',
        email: 'student2@lms.com',
        password: studentPassword,
        role: 'STUDENT'
      }
    });

    const student3 = await db.user.create({
      data: {
        name: 'Carol Martinez',
        email: 'student3@lms.com',
        password: studentPassword,
        role: 'STUDENT'
      }
    });

    console.log('✅ Users created');

    // Create courses
    const course1 = await db.course.create({
      data: {
        title: 'Complete Web Development Bootcamp',
        slug: 'complete-web-development-bootcamp',
        description: 'Master HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and become a professional web developer.',
        thumbnail: 'https://via.placeholder.com/640x360?text=Web+Dev',
        price: 6999,
        discountPrice: 4999,
        category: 'Web Development',
        level: 'BEGINNER',
        language: 'English',
        instructorId: instructor1.id,
        isPublished: true,
        tags: ['web', 'javascript', 'react', 'node'],
        requirements: ['Basic computer knowledge', 'Text editor'],
        outcomes: ['Build full-stack web applications', 'Understand React and Node.js']
      }
    });

    const course2 = await db.course.create({
      data: {
        title: 'Python for Data Science',
        slug: 'python-for-data-science',
        description: 'Learn Python, NumPy, Pandas, and Machine Learning. Become a data science professional.',
        thumbnail: 'https://via.placeholder.com/640x360?text=Data+Science',
        price: 5999,
        discountPrice: 3999,
        category: 'Data Science',
        level: 'INTERMEDIATE',
        language: 'English',
        instructorId: instructor2.id,
        isPublished: true,
        tags: ['python', 'data-science', 'machine-learning'],
        requirements: ['Python basics', 'Math fundamentals'],
        outcomes: ['Build ML models', 'Analyze data']
      }
    });

    const course3 = await db.course.create({
      data: {
        title: 'Advanced JavaScript Patterns',
        slug: 'advanced-javascript-patterns',
        description: 'Master advanced JavaScript concepts including closures, prototypes, and design patterns.',
        thumbnail: 'https://via.placeholder.com/640x360?text=JavaScript',
        price: 0,
        category: 'Programming',
        level: 'ADVANCED',
        language: 'English',
        instructorId: instructor1.id,
        isPublished: true,
        tags: ['javascript', 'patterns'],
        requirements: ['JavaScript fundamentals'],
        outcomes: ['Understand advanced JS patterns']
      }
    });

    console.log('✅ Courses created');

    // Create sections and lessons for course 1
    const section1_1 = await db.section.create({
      data: {
        title: 'Getting Started with Web Development',
        order: 1,
        courseId: course1.id
      }
    });

    const section1_2 = await db.section.create({
      data: {
        title: 'HTML & CSS Fundamentals',
        order: 2,
        courseId: course1.id
      }
    });

    // Lessons for section 1.1
    await db.lesson.create({
      data: {
        title: 'Introduction to Web Development',
        order: 1,
        youtubeUrl: 'bMknfKXIFA8',
        duration: 600,
        isFree: true,
        sectionId: section1_1.id
      }
    });

    await db.lesson.create({
      data: {
        title: 'Setting Up Your Development Environment',
        order: 2,
        youtubeUrl: 'wm5gMKuwSYk',
        duration: 900,
        isFree: true,
        sectionId: section1_1.id
      }
    });

    await db.lesson.create({
      data: {
        title: 'Career in Web Development',
        order: 3,
        youtubeUrl: '30LWjhZzg50',
        duration: 450,
        isFree: false,
        sectionId: section1_1.id
      }
    });

    // Lessons for section 1.2
    await db.lesson.create({
      data: {
        title: 'HTML Basics',
        order: 1,
        youtubeUrl: 'PkZNo7MFNFg',
        duration: 1200,
        isFree: false,
        sectionId: section1_2.id
      }
    });

    console.log('✅ Sections and lessons created');

    // Create sections and lessons for course 2
    const section2_1 = await db.section.create({
      data: {
        title: 'Python Fundamentals',
        order: 1,
        courseId: course2.id
      }
    });

    await db.lesson.create({
      data: {
        title: 'Python Introduction',
        order: 1,
        youtubeUrl: 'KGkiIBTq0y0',
        duration: 800,
        isFree: true,
        sectionId: section2_1.id
      }
    });

    await db.lesson.create({
      data: {
        title: 'Python Data Types',
        order: 2,
        youtubeUrl: 'hdI2bqOjy3c',
        duration: 1000,
        isFree: false,
        sectionId: section2_1.id
      }
    });

    // Course 3 sections
    const section3_1 = await db.section.create({
      data: {
        title: 'Advanced Concepts',
        order: 1,
        courseId: course3.id
      }
    });

    await db.lesson.create({
      data: {
        title: 'Closures Explained',
        order: 1,
        youtubeUrl: '3Kq1MIfTWCE',
        duration: 1500,
        isFree: true,
        sectionId: section3_1.id
      }
    });

    console.log('✅ All sections and lessons created');

    // Create enrollments
    await db.enrollment.create({
      data: {
        userId: student1.id,
        courseId: course1.id
      }
    });

    await db.enrollment.create({
      data: {
        userId: student2.id,
        courseId: course1.id
      }
    });

    await db.enrollment.create({
      data: {
        userId: student1.id,
        courseId: course2.id
      }
    });

    await db.enrollment.create({
      data: {
        userId: student3.id,
        courseId: course3.id
      }
    });

    console.log('✅ Enrollments created');

    // Create progress for student1 in course1
    const course1Lessons = await db.lesson.findMany({
      where: {
        section: {
          courseId: course1.id
        }
      }
    });

    await db.progress.create({
      data: {
        userId: student1.id,
        lessonId: course1Lessons[0].id,
        completed: true
      }
    });

    await db.progress.create({
      data: {
        userId: student1.id,
        lessonId: course1Lessons[1].id,
        completed: true
      }
    });

    console.log('✅ Progress created');

    // Create coupons
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.coupon.create({
      data: {
        code: 'SAVE10',
        discountPercent: 10,
        maxUses: 100,
        expiresAt,
        isActive: true
      }
    });

    await db.coupon.create({
      data: {
        code: 'LAUNCH50',
        discountPercent: 50,
        maxUses: 50,
        expiresAt,
        isActive: true
      }
    });

    console.log('✅ Coupons created');

    // Create sample order
    const order = await db.order.create({
      data: {
        userId: student2.id,
        totalAmount: 4999,
        discount: 1000,
        couponCode: 'SAVE10',
        status: 'COMPLETED',
        stripePaymentIntentId: 'pi_sample_12345'
      }
    });

    await db.orderItem.create({
      data: {
        orderId: order.id,
        courseId: course1.id,
        price: 4999
      }
    });

    console.log('✅ Sample order created');

    console.log('🌱 Database seeded successfully!');
    console.log('📝 Default Credentials:');
    console.log('Admin: admin@lms.com / Password123!');
    console.log('Instructor: instructor1@lms.com / Password123!');
    console.log('Student: student1@lms.com / Password123!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

seed();
