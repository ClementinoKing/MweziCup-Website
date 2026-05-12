export type BlogPostStatus = 'Published' | 'Draft' | 'Archived';

export type MediaType = 'Image' | 'Video' | 'Document';

export type MessageStatus = 'New' | 'Read' | 'Replied';

export type SubscriberStatus = 'Active' | 'Unsubscribed';

export type AdminRole = 'Super Admin' | 'Editor' | 'Viewer';

export type AdminStatus = 'Active' | 'Invited' | 'Disabled';

export type SectionVisibility = 'Visible' | 'Hidden';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: BlogPostStatus;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  seoTitle: string;
  seoDescription: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  size: string;
  dimensions: string;
  uploadedAt: string;
  alt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: MessageStatus;
  receivedAt: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscriptionDate: string;
  status: SubscriberStatus;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLogin: string;
}

export interface AdminProfile {
  id: string;
  displayName: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt: string | null;
}

export interface HomepageFeatureBlock {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HomepageCTASection {
  id: string;
  title: string;
  description: string;
  buttonText: string;
}

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaButtonText: string;
  heroBackgroundImage: string;
  productImage: string;
  marqueeWords: string[];
  featureBlocks: HomepageFeatureBlock[];
  ctaSections: HomepageCTASection[];
}

export interface WebsiteSection {
  id: string;
  title: string;
  description: string;
  order: number;
  visibility: SectionVisibility;
  type: 'Hero' | 'Product' | 'Education' | 'CTA' | 'FAQ' | 'Support';
  productName: string;
  productDescription: string;
  benefits: string[];
  usageInstructions: string[];
  featureHighlights: string[];
  faqItems: { question: string; answer: string }[];
  productImages: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  kind: 'publish' | 'draft' | 'message' | 'media' | 'user' | 'update';
}

export interface SiteSettings {
  websiteName: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  phoneNumber: string;
  whatsappNumber: string;
  facebookLink: string;
  instagramLink: string;
  tiktokLink: string;
  seoTitle: string;
  seoDescription: string;
  footerText: string;
}
