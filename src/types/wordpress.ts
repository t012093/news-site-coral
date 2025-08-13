// WordPress REST API の型定義

export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  caption?: {
    rendered: string;
  };
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      thumbnail?: {
        file: string;
        width: number;
        height: number;
        source_url: string;
      };
      medium?: {
        file: string;
        width: number;
        height: number;
        source_url: string;
      };
      large?: {
        file: string;
        width: number;
        height: number;
        source_url: string;
      };
      full: {
        file: string;
        width: number;
        height: number;
        source_url: string;
      };
    };
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
}

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'draft' | 'private' | 'pending';
  type: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: string;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: WordPressCategory[][];
    'author'?: WordPressAuthor[];
  };
  // カスタムフィールド（ACF）
  acf?: {
    featured_image_alt?: string;
    article_subtitle?: string;
    reading_time?: number;
    author_bio?: string;
    related_articles?: number[];
    [key: string]: any;
  };
}

export interface WordPressApiResponse<T> {
  data: T;
  headers: {
    'x-wp-total': string;
    'x-wp-totalpages': string;
  };
}

export interface WordPressQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  author?: number;
  categories?: string | number;
  tags?: string | number;
  include?: number[];
  exclude?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug';
  slug?: string;
  status?: 'publish' | 'draft' | 'private' | 'pending';
  _embed?: boolean;
  _fields?: string;
}

// フロントエンド用に変換された記事型
export interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author: {
    id: number;
    name: string;
    avatar: string;
    bio?: string;
  };
  featuredImage?: {
    id: number;
    url: string;
    alt: string;
    sizes: {
      thumbnail?: string;
      medium?: string;
      large?: string;
      full: string;
    };
  };
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  readingTime?: number;
  relatedArticles?: number[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}