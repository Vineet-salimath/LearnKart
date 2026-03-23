// Simple test script to verify API functionality
import { coursesAPI } from './src/api/mockAPI.js';

async function testAPI() {
  console.log('Testing coursesAPI.getAll()...');

  try {
    const response = await coursesAPI.getAll({ limit: 6 });
    console.log('✅ API Response structure:', {
      hasData: !!response.data,
      hasDataData: !!response.data?.data,
      hasCourses: !!response.data?.data?.courses,
      coursesCount: response.data?.data?.courses?.length || 0
    });

    if (response.data?.data?.courses) {
      console.log('📚 First course:', {
        id: response.data.data.courses[0]?.id,
        title: response.data.data.courses[0]?.title,
        hasVideos: !!response.data.data.courses[0]?.videos
      });
    }

    console.log('✅ API test passed successfully');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.error('Full error:', error);
  }
}

testAPI();