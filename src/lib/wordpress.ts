import axios, { AxiosInstance } from 'axios';
import {
  WordPressPost,
  WordPressCategory,
  WordPressTag,
  WordPressQueryParams,
  Article,
  Category,
  Tag,
} from '../types/wordpress';

class WordPressAPI {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // バックエンドのプロキシエンドポイントを使用
    const apiUrl = import.meta.env.VITE_API_URL || 'https://news-site-coral-production.up.railway.app/api';
    this.baseURL = `${apiUrl}/news`;
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // レスポンス インターセプターでエラーハンドリング
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('WordPress API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  // 記事一覧を取得
  async getPosts(params: WordPressQueryParams = {}): Promise<{
    posts: Article[];
    total: number;
    totalPages: number;
  }> {
    try {
      const queryParams = {
        _embed: true,
        per_page: 10,
        ...params,
      };

      // モックデータを使用（WordPressへのCORS問題を回避）
      const response = await this.api.get('/mock-posts', { params: queryParams });
      
      // モックデータはすでに簡略化された形式なので、簡易的な変換を行う
      const posts = response.data.map((post: any) => this.transformMockPost(post));
      const total = response.data.length;
      const totalPages = 1;

      return { posts, total, totalPages };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { posts: [], total: 0, totalPages: 0 };
    }
  }

  // 記事詳細を取得（スラッグまたはIDで）
  async getPost(identifier: string | number): Promise<Article | null> {
    try {
      let endpoint = '/posts';
      let params: any = { _embed: true };

      if (typeof identifier === 'string') {
        // スラッグで検索
        params.slug = identifier;
      } else {
        // IDで検索
        endpoint = `/posts/${identifier}`;
      }

      const response = await this.api.get(endpoint, { params });
      const postData = Array.isArray(response.data) ? response.data[0] : response.data;

      if (!postData) {
        return null;
      }

      return this.transformPost(postData);
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  // カテゴリー一覧を取得
  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.api.get('/categories', {
        params: { per_page: 100 }
      });

      return response.data.map((cat: WordPressCategory) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        count: cat.count,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // タグ一覧を取得
  async getTags(): Promise<Tag[]> {
    try {
      const response = await this.api.get('/tags', {
        params: { per_page: 100 }
      });

      return response.data.map((tag: WordPressTag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        count: tag.count,
      }));
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  // カテゴリー別記事を取得
  async getPostsByCategory(categorySlug: string, params: WordPressQueryParams = {}): Promise<{
    posts: Article[];
    total: number;
    totalPages: number;
  }> {
    try {
      // まずカテゴリーIDを取得
      const categories = await this.getCategories();
      const category = categories.find(cat => cat.slug === categorySlug);
      
      if (!category) {
        return { posts: [], total: 0, totalPages: 0 };
      }

      return this.getPosts({
        ...params,
        categories: category.id,
      });
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      return { posts: [], total: 0, totalPages: 0 };
    }
  }

  // 検索
  async searchPosts(query: string, params: WordPressQueryParams = {}): Promise<{
    posts: Article[];
    total: number;
    totalPages: number;
  }> {
    return this.getPosts({
      ...params,
      search: query,
    });
  }

  // WordPressの記事データをフロントエンド用に変換
  private transformPost(post: WordPressPost): Article {
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const categories = post._embedded?.['wp:term']?.[0] || [];
    const tags = post._embedded?.['wp:term']?.[1] || [];
    const author = post._embedded?.['author']?.[0];

    return {
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: this.stripHtml(post.excerpt.rendered),
      date: post.date,
      modified: post.modified,
      author: {
        id: author?.id || post.author,
        name: author?.name || 'Unknown Author',
        avatar: author?.avatar_urls?.['96'] || '',
        bio: author?.description || '',
      },
      featuredImage: featuredMedia ? {
        id: featuredMedia.id,
        url: featuredMedia.source_url,
        alt: featuredMedia.alt_text || '',
        sizes: {
          thumbnail: featuredMedia.media_details.sizes.thumbnail?.source_url,
          medium: featuredMedia.media_details.sizes.medium?.source_url,
          large: featuredMedia.media_details.sizes.large?.source_url,
          full: featuredMedia.media_details.sizes.full?.source_url || featuredMedia.source_url,
        },
      } : undefined,
      categories: categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })),
      tags: tags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })),
      readingTime: post.acf?.reading_time,
      relatedArticles: post.acf?.related_articles,
    };
  }

  // HTMLタグを除去
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  // モックデータ用の変換メソッド
  private transformMockPost(post: any): Article {
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const author = post._embedded?.['author']?.[0];

    return {
      id: post.id,
      slug: `post-${post.id}`,
      title: post.title?.rendered || 'Untitled',
      content: post.content?.rendered || '',
      excerpt: this.stripHtml(post.excerpt?.rendered || ''),
      date: post.date,
      modified: post.date,
      author: {
        id: 1,
        name: author?.name || 'CORAL編集部',
        avatar: '',
        bio: '',
      },
      featuredImage: featuredMedia ? {
        id: 1,
        url: featuredMedia.source_url,
        alt: '',
        sizes: {
          thumbnail: featuredMedia.source_url,
          medium: featuredMedia.source_url,
          large: featuredMedia.source_url,
          full: featuredMedia.source_url,
        },
      } : undefined,
      categories: [],
      tags: [],
      readingTime: undefined,
      relatedArticles: undefined,
    };
  }

  // 環境設定確認用のメソッド
  getApiInfo() {
    return {
      baseURL: this.baseURL,
      hasApiUrl: !!import.meta.env.VITE_WP_API_URL,
    };
  }
}

// シングルトンインスタンスをエクスポート
export const wordPressAPI = new WordPressAPI();

// 便利な関数もエクスポート
export const {
  getPosts,
  getPost,
  getCategories,
  getTags,
  getPostsByCategory,
  searchPosts,
} = wordPressAPI;