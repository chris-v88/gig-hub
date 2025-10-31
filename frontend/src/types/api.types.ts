// API Response types for all entities

export type ApiResponse<T> = {
  message: string;
  content: T;
  statusCode: number;
};

export type PaginationResponse<T> = {
  data: T[];
  totalRow: number;
  pageIndex: number;
  pageSize: number;
  totalPage: number;
};

// Category types
export type Category = {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
  Subcategories?: Subcategory[];
};

// Subcategory types
export type Subcategory = {
  id: number;
  name: string;
  category_id?: number;
  created_at: string;
  updated_at?: string;
  category?: {
    id: number;
    name: string;
  };
};

export type SubcategoryGroup = {
  id: number;
  name: string;
  image_url?: string;
  category_id: number;
  subcategories: Subcategory[];
  created_at: string;
  updated_at?: string;
};

// User types
export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  role: string;
  username?: string;
  profile_image?: string;
  description?: string;
  country?: string;
  is_online?: boolean;
  total_orders_completed?: number;
  created_at: string;
  updated_at?: string;
  UserSkills?: UserSkill[];
  UserCertifications?: UserCertification[];
};

export type UserSkill = {
  id: number;
  user_id: number;
  skill_id: number;
  skill: {
    id: number;
    name: string;
    description?: string;
  };
};

export type UserCertification = {
  id: number;
  user_id: number;
  name: string;
  issuing_organization?: string;
  issue_date?: string;
  expiry_date?: string;
};

// Order types
export type Order = {
  id: number;
  gig_id: number;
  seller_id: number;
  buyer_id: number;
  title: string;
  description?: string;
  price: number;
  delivery_time: number;
  revisions: number;
  status: string;
  completed: boolean;
  order_date: string;
  completion_date?: string;
  created_at: string;
  updated_at?: string;
  gig?: {
    id: number;
    title: string;
    price: number;
    image_url?: string;
  };
  seller?: {
    id: number;
    name: string;
    username?: string;
    profile_image?: string;
  };
  buyer?: {
    id: number;
    name: string;
    username?: string;
    profile_image?: string;
  };
  Reviews?: Review[];
};

// Review types
export type Review = {
  id: number;
  order_id: number;
  gig_id: number;
  reviewer_id: number;
  reviewee_id: number;
  reviewer_role: 'buyer' | 'seller';
  reviewee_role: 'buyer' | 'seller';
  rating: number;
  content: string;
  is_public: boolean;
  review_date: string;
  created_at: string;
  updated_at?: string;
  reviewer?: {
    id: number;
    name: string;
    username?: string;
    profile_image?: string;
  };
  reviewee?: {
    id: number;
    name: string;
    username?: string;
  };
  gig?: {
    id: number;
    title: string;
  };
};

// Skill types
export type Skill = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  UserSkills?: {
    user: {
      id: number;
      name: string;
      username?: string;
      profile_image?: string;
    };
  }[];
  _count?: {
    UserSkills: number;
  };
};

// Enhanced Gig types for new endpoints
export type GigCategory = {
  id: number;
  name: string;
  subcategories?: Subcategory[];
};

export type GigMenuCategory = GigCategory & {
  icon?: string;
  description?: string;
};

export type EnhancedGig = {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  price: number;
  delivery_time: number;
  revisions?: number;
  image_url?: string;
  status?: string;
  average_rating: number;
  total_reviews: number;
  orders_completed?: number;
  created_at: string;
  updated_at?: string;
  seller_id: number;
  category_id?: number;
  subcategory_id?: number;
  Users?: {
    id: number;
    name: string;
    username?: string;
    profile_image?: string;
    description?: string;
    total_orders_completed?: number;
    created_at?: string;
  };
  category?: GigCategory;
  images_rel?: {
    id: number;
    image_url: string;
  }[];
  Reviews?: Review[];
};

// Search and pagination types
export type SearchParams = {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
};

export type TableColumn<T> = {
  key: keyof T | string;
  title: string;
  render?: (value: unknown, record: T) => React.ReactNode;
  sorter?: boolean;
  width?: string;
};

export type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
};

// Upload response types
export type UploadResponse = {
  message: string;
  imageUrl?: string;
  avatarUrl?: string;
};
