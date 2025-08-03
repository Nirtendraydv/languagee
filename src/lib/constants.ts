

export const COURSES_PLACEHOLDER = [
  {
    id: '1',
    title: 'Beginner English: The Basics',
    level: 'Beginner',
    ageGroup: 'Adults',
    goal: 'Grammar',
    description: 'Master the fundamentals of English, from basic vocabulary to simple sentence structures.',
    badge: 'Free Trial',
    image: 'https://images.unsplash.com/photo-1543165794-803225536569?q=80&w=600&auto=format&fit=crop',
    dataAiHint: 'abc blocks',
    modules: [
        { title: "Introduction to Greetings", description: "Learn how to greet people and introduce yourself.", videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { title: "The Alphabet and Pronunciation", description: "Master the English alphabet and basic sounds.", videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
    enrolledUserIds: [],
  },
  {
    id: '2',
    title: 'Intermediate Conversation Skills',
    level: 'Intermediate',
    ageGroup: 'Adults',
    goal: 'Conversation',
    description: 'Build confidence in speaking and listening with real-world conversation practice.',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
    dataAiHint: 'people talking',
    modules: [
        { title: "Everyday Conversations", description: "Practice common scenarios like ordering food and making appointments.", videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { title: "Expressing Opinions", description: "Learn phrases to share your thoughts and opinions politely.", videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
    enrolledUserIds: [],
  },
  {
    id: '3',
    title: 'Advanced Business English',
    level: 'Advanced',
    ageGroup: 'Adults',
    goal: 'Business English',
    description: 'Perfect your professional communication for meetings, presentations, and negotiations.',
    badge: '',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=600&auto=format&fit=crop',
    dataAiHint: 'business meeting',
    modules: [
        { title: "Mastering Meetings", description: "Learn vocabulary and etiquette for effective participation in business meetings.", videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
    enrolledUserIds: [],
  },
];

export const TUTORS_PLACEHOLDER = [
  {
    id: '1',
    name: 'Jane Doe',
    country: 'USA',
    experience: 5,
    rating: 4.9,
    accent: 'American',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    dataAiHint: 'woman smiling',
    bio: 'Jane is a certified ESL instructor with a passion for making learning fun and accessible. She specializes in helping beginners build a strong foundation and gain confidence in their speaking abilities.',
    specialties: ['Beginner English', 'Conversational Practice', 'Pronunciation', 'Confidence Building'],
  },
  {
    id: '2',
    name: 'John Smith',
    country: 'UK',
    experience: 8,
    rating: 4.8,
    accent: 'British',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    dataAiHint: 'man portrait',
    bio: 'John has extensive experience in corporate training and business English. He excels at helping professionals refine their language skills for the global workplace, focusing on clarity, precision, and cultural nuance.',
    specialties: ['Business English', 'Advanced Grammar', 'Presentation Skills', 'Negotiation'],
  },
];

export const USERS_PLACEHOLDER = [
  {
    uid: 'placeholder-user-1',
    email: 'user1@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'placeholder-user-2',
    email: 'user2@example.com',
    createdAt: new Date().toISOString(),
  }
];


export const TESTIMONIALS = [
  {
    name: 'Alex Johnson',
    quote: 'English Excellence completely transformed my confidence in speaking English. The tutors are fantastic and the lessons are so engaging!',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=100&auto=format&fit=crop',
  },
  {
    name: 'Maria Garcia',
    quote: 'I needed to improve my Business English for work, and this platform was a game-changer. I highly recommend it.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
  },
  {
    name: 'Kenji Tanaka',
    quote: 'The interactive lessons make learning fun, not a chore. I look forward to my classes every week.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
  },
  {
    name: 'Fatima Al-Sayed',
    quote: 'Thanks to English Excellence, I passed my exams with a great score. The prep course was thorough and very helpful.',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100&auto=format&fit=crop',
  },
];

export const TUTOR_FAQ = `
Q: How do I book a class?
A: To book a class, go to the Tutors page, select a tutor, and click the "Book Trial" or "Book Lesson" button. You will then be able to see their calendar and choose a time that works for you.

Q: Can I change my tutor?
A: Yes, you can switch tutors at any time. We encourage you to try different tutors to find the one that best fits your learning style.

Q: What happens if I miss a class?
A: If you miss a class without canceling at least 24 hours in advance, the class credit may be forfeited. Please check our cancellation policy for more details.

Q: How long is a typical lesson?
A: Standard lessons are 50 minutes long, but some tutors may offer different durations. You can see the available options on their profile.

Q: What materials do I need?
A: All you need is a stable internet connection, a device with a camera and microphone (like a computer or tablet), and a willingness to learn! Tutors will provide all necessary learning materials.
`;

// It's better to keep the AI prompt data separate from the main constants
export const AI_TUTOR_COURSES_CONTEXT = [
  {
    id: 1,
    title: 'Beginner English: The Basics',
    level: 'Beginner',
    ageGroup: 'Adults',
    goal: 'Grammar',
    description: 'Master the fundamentals of English, from basic vocabulary to simple sentence structures.',
  },
  {
    id: 2,
    title: 'Intermediate Conversation Skills',
    level: 'Intermediate',
    ageGroup: 'Adults',
    goal: 'Conversation',
    description: 'Build confidence in speaking and listening with real-world conversation practice.',
  },
  {
    id: 3,
    title: 'Advanced Business English',
    level: 'Advanced',
    ageGroup: 'Adults',
    goal: 'Business English',
    description: 'Perfect your professional communication for meetings, presentations, and negotiations.',
  },
  {
    id: 5,
    title: 'English for Kids: Fun & Games',
    level: 'Beginner',
    ageGroup: 'Kids',
    goal: 'Conversation',
    description: 'An exciting, game-based curriculum to get young learners excited about English.',
  },
  {
    id: 6,
    title: 'Grammar Guru',
    level: 'Intermediate',
    ageGroup: 'Teens',
    goal: 'Grammar',
    description: 'Deep dive into complex grammar topics to write and speak with precision.',
  },
];
