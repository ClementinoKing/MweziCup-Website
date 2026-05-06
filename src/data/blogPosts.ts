export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  author: string;
  readingTime: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'beginners-guide-to-using-a-menstrual-cup',
    title: 'Beginner’s Guide to Using a Menstrual Cup',
    category: 'Beginner Guide',
    excerpt: 'Learn how to fold, insert, wear, remove, and clean your mweziCup with confidence.',
    date: 'May 2026',
    author: 'mweziCup Team',
    readingTime: '6 min read',
    content: [
      'This placeholder article introduces the key steps for getting started with a menstrual cup. In the final version, it can expand into a full educational guide with visuals, diagrams, and safety tips.',
      'For now, the layout is designed to support clear reading flow, helpful section spacing, and a reassuring tone that matches the brand.',
    ],
  },
  {
    slug: 'pads-vs-menstrual-cups-whats-the-difference',
    title: 'Pads vs Menstrual Cups: What’s the Difference?',
    category: 'Period Care',
    excerpt:
      'Understand how reusable menstrual cups compare to disposable pads in comfort, cost, waste, and convenience.',
    date: 'May 2026',
    author: 'mweziCup Team',
    readingTime: '5 min read',
    content: [
      'This placeholder comparison article can later be replaced with a detailed explainer on comfort, sustainability, long-term cost, and day-to-day convenience.',
      'The current content keeps the tone informative, supportive, and beginner friendly.',
    ],
  },
  {
    slug: 'how-to-care-for-your-mweziCup',
    title: 'How to Care for Your mweziCup',
    category: 'Cup Care',
    excerpt: 'Simple cleaning and storage tips to keep your cup safe, fresh, and ready for every cycle.',
    date: 'May 2026',
    author: 'mweziCup Team',
    readingTime: '4 min read',
    content: [
      'This placeholder care guide can later include washing instructions, sterilisation steps, and storage tips.',
      'It is structured as an article template so real content can be dropped in without changing the route or layout.',
    ],
  },
  {
    slug: 'choosing-the-right-fit-for-comfort',
    title: 'Choosing the Right Fit for Comfort',
    category: 'Product Tips',
    excerpt: 'Learn what to consider when choosing a reusable cup that feels natural and secure.',
    date: 'May 2026',
    author: 'mweziCup Team',
    readingTime: '5 min read',
    content: [
      'This placeholder post supports the blog listing grid with an additional educational article.',
      'It can later cover cup sizing, stem length, and insertion confidence.',
    ],
  },
  {
    slug: 'period-care-for-busy-days-and-travel',
    title: 'Period Care for Busy Days and Travel',
    category: 'Lifestyle',
    excerpt: 'Practical guidance for staying comfortable at work, school, the gym, or while on the move.',
    date: 'May 2026',
    author: 'mweziCup Team',
    readingTime: '4 min read',
    content: [
      'This placeholder content gives the site a stronger blog archive while keeping the experience consistent.',
      'It can later be expanded into a lifestyle and travel-focused guide for real users.',
    ],
  },
];

export function getBlogPostBySlug(slug: string | undefined) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostPath(slug: string) {
  return `/blog/${slug}`;
}
