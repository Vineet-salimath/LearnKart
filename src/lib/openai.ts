import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const generateAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  if (!openai) {
    // Mock responses when no API key is provided
    const mockResponses = [
      "I'm here to help you learn! While I'm currently in demo mode (no OpenAI API key configured), I can still provide general guidance. What topic would you like to explore?",
      "That's a great question! In a fully configured environment, I'd provide detailed explanations and examples. For now, I recommend reviewing the lesson materials and practicing the concepts.",
      "I understand you're looking for help with that topic. The course materials contain comprehensive information, and I'd encourage you to work through the examples step by step.",
      "Learning programming takes practice! Try breaking down the problem into smaller parts and tackling each one individually. The lesson content provides good examples to follow.",
      "That's an important concept to master. I'd recommend reviewing the relevant lesson materials and trying some hands-on practice to reinforce your understanding."
    ];
    
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    if (lastMessage.includes('python') || lastMessage.includes('code')) {
      return "Great question about Python! I'd recommend starting with the basics in our Python course - variables, data types, and control structures. Practice writing small programs to reinforce each concept.";
    }
    
    if (lastMessage.includes('react') || lastMessage.includes('component')) {
      return "React components are the building blocks of React applications! Focus on understanding props, state, and the component lifecycle. Start with functional components and hooks for modern React development.";
    }
    
    if (lastMessage.includes('machine learning') || lastMessage.includes('ml')) {
      return "Machine learning is fascinating! Begin with understanding your data, then move to preprocessing, model selection, and evaluation. Start with simple algorithms like linear regression before moving to complex ones.";
    }
    
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm currently experiencing technical difficulties. Please try again later or refer to the course materials.";
  }
};

export const generateQuiz = async (lessonContent: string, numQuestions: number = 5): Promise<QuizQuestion[]> => {
  if (!openai) {
    // Mock quiz questions based on lesson content keywords
    const mockQuizzes = {
      python: [
        {
          question: "What is the correct way to create a variable in Python?",
          options: ["var x = 5", "x = 5", "int x = 5", "x := 5"],
          correctAnswer: 1,
          explanation: "In Python, you simply assign a value to a variable name using the = operator."
        },
        {
          question: "Which of these is a Python data type?",
          options: ["list", "array", "vector", "matrix"],
          correctAnswer: 0,
          explanation: "List is a built-in data type in Python for storing sequences of items."
        },
        {
          question: "What does the 'len()' function do?",
          options: ["Calculates length", "Returns the number of items", "Counts characters", "All of the above"],
          correctAnswer: 3,
          explanation: "The len() function returns the length (number of items) of an object."
        }
      ],
      react: [
        {
          question: "What is JSX?",
          options: ["JavaScript Extension", "JavaScript XML", "Java Syntax Extension", "Just Another Framework"],
          correctAnswer: 1,
          explanation: "JSX stands for JavaScript XML and allows you to write HTML-like syntax in JavaScript."
        },
        {
          question: "Which hook is used for managing component state?",
          options: ["useEffect", "useState", "useContext", "useCallback"],
          correctAnswer: 1,
          explanation: "useState is the hook used for managing local component state in functional components."
        },
        {
          question: "What are props in React?",
          options: ["Properties", "Functions", "State variables", "Event handlers"],
          correctAnswer: 0,
          explanation: "Props (properties) are how you pass data from parent to child components in React."
        }
      ],
      machine: [
        {
          question: "What is supervised learning?",
          options: ["Learning with a teacher", "Learning with labeled data", "Learning without data", "Learning algorithms"],
          correctAnswer: 1,
          explanation: "Supervised learning uses labeled training data to learn patterns and make predictions."
        },
        {
          question: "Which is a classification algorithm?",
          options: ["Linear Regression", "Logistic Regression", "K-means", "PCA"],
          correctAnswer: 1,
          explanation: "Logistic Regression is used for binary and multiclass classification problems."
        },
        {
          question: "What is overfitting?",
          options: ["Model is too simple", "Model memorizes training data", "Model has no parameters", "Model is perfect"],
          correctAnswer: 1,
          explanation: "Overfitting occurs when a model learns the training data too well and fails to generalize."
        }
      ],
      pandas: [
        {
          question: "What is a DataFrame?",
          options: ["A 1D structure", "A 2D structure", "A 3D structure", "A function"],
          correctAnswer: 1,
          explanation: "A DataFrame is a 2-dimensional labeled data structure with columns of potentially different types."
        },
        {
          question: "Which method is used to read CSV files?",
          options: ["read_csv()", "load_csv()", "import_csv()", "get_csv()"],
          correctAnswer: 0,
          explanation: "pandas.read_csv() is the standard method for reading CSV files into a DataFrame."
        },
        {
          question: "What does 'groupby' do?",
          options: ["Sorts data", "Groups data by column values", "Filters data", "Joins tables"],
          correctAnswer: 1,
          explanation: "groupby() groups DataFrame rows based on the values in one or more columns."
        }
      ]
    };
    
    const content = lessonContent.toLowerCase();
    
    if (content.includes('python')) {
      return mockQuizzes.python.slice(0, numQuestions);
    } else if (content.includes('react') || content.includes('jsx')) {
      return mockQuizzes.react.slice(0, numQuestions);
    } else if (content.includes('machine learning') || content.includes('algorithm')) {
      return mockQuizzes.machine.slice(0, numQuestions);
    } else if (content.includes('pandas') || content.includes('dataframe')) {
      return mockQuizzes.pandas.slice(0, numQuestions);
    }
    
    // Default general questions
    return [
      {
        question: "What is the most important aspect of learning programming?",
        options: ["Memorizing syntax", "Understanding concepts", "Using advanced tools", "Reading documentation"],
        correctAnswer: 1,
        explanation: "Understanding concepts is more important than memorizing syntax, as concepts remain consistent across languages."
      },
      {
        question: "How should you approach debugging code?",
        options: ["Rewrite everything", "Use print statements", "Systematic approach", "Ask for help immediately"],
        correctAnswer: 2,
        explanation: "A systematic approach to debugging helps identify the root cause efficiently."
      }
    ].slice(0, numQuestions);
  }

  try {
    const prompt = `Based on this lesson content, create ${numQuestions} multiple choice questions:

${lessonContent}

Return a JSON array of questions with this format:
{
  "question": "Question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0,
  "explanation": "Explanation of the correct answer"
}

Make sure the questions test understanding of key concepts from the lesson.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an educational content creator. Create quiz questions based on lesson content." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content generated');

    const questions = JSON.parse(content) as QuizQuestion[];
    return questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    // Return fallback questions
    return [
      {
        question: "What did you learn from this lesson?",
        options: ["New concepts", "Practical skills", "Theoretical knowledge", "All of the above"],
        correctAnswer: 3,
        explanation: "Effective lessons combine concepts, skills, and theory for comprehensive learning."
      }
    ];
  }
};

export const getRecommendations = async (userProgress: any[], courses: any[]): Promise<string[]> => {
  if (!openai) {
    // Mock recommendations
    const mockRecommendations = [
      "Based on your progress, consider exploring advanced topics in your current courses.",
      "You might enjoy the Machine Learning Fundamentals course to expand your technical skills.",
      "The React course would complement your Python knowledge for full-stack development.",
      "Data Science with Pandas builds naturally on your programming foundation.",
      "Consider reviewing completed lessons to reinforce your understanding before moving to new topics."
    ];
    
    return mockRecommendations.slice(0, 3);
  }

  try {
    const prompt = `Based on this user's learning progress and available courses, provide 3 personalized course recommendations:

User Progress: ${JSON.stringify(userProgress, null, 2)}
Available Courses: ${JSON.stringify(courses, null, 2)}

Provide specific, actionable recommendations based on their completed courses and learning patterns.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a learning advisor providing personalized course recommendations." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content || "";
    return content.split('\n').filter(rec => rec.trim().length > 0).slice(0, 3);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [
      "Continue with your current learning path - you're making great progress!",
      "Consider exploring related topics to broaden your knowledge base.",
      "Practice implementing what you've learned through hands-on projects."
    ];
  }
};