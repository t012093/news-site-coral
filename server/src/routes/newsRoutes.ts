import { Router } from 'express';
import axios from 'axios';

const router = Router();

// WordPress APIプロキシエンドポイント
router.get('/wordpress-posts', async (req, res) => {
  try {
    const { 
      per_page = '6', 
      orderby = 'date', 
      order = 'desc',
      _embed = 'true' 
    } = req.query;

    const response = await axios.get('https://demo.wp-api.org/wp-json/wp/v2/posts', {
      params: {
        _embed,
        per_page,
        orderby,
        order
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch WordPress posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// モックニュースデータ（フォールバック用）
router.get('/mock-posts', async (req, res) => {
  const mockPosts = [
    {
      id: 1,
      title: { rendered: 'AI革命：2025年の最新トレンド' },
      excerpt: { rendered: '<p>人工知能技術の急速な発展により、様々な業界で革新的な変化が起きています...</p>' },
      date: new Date().toISOString(),
      link: '#',
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://picsum.photos/800/600?random=1'
        }],
        author: [{
          name: 'CORAL編集部'
        }]
      }
    },
    {
      id: 2,
      title: { rendered: 'サステナビリティ：企業の新たな責任' },
      excerpt: { rendered: '<p>気候変動への対応が急務となる中、企業のサステナビリティへの取り組みが注目されています...</p>' },
      date: new Date(Date.now() - 86400000).toISOString(),
      link: '#',
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://picsum.photos/800/600?random=2'
        }],
        author: [{
          name: 'CORAL編集部'
        }]
      }
    },
    {
      id: 3,
      title: { rendered: 'デジタルトランスフォーメーションの未来' },
      excerpt: { rendered: '<p>DXの波は止まることなく、あらゆる産業に変革をもたらしています...</p>' },
      date: new Date(Date.now() - 172800000).toISOString(),
      link: '#',
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://picsum.photos/800/600?random=3'
        }],
        author: [{
          name: 'CORAL編集部'
        }]
      }
    },
    {
      id: 4,
      title: { rendered: 'Web3.0とメタバースの融合' },
      excerpt: { rendered: '<p>ブロックチェーン技術とメタバースの融合により、新たなデジタル経済圏が形成されています...</p>' },
      date: new Date(Date.now() - 259200000).toISOString(),
      link: '#',
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://picsum.photos/800/600?random=4'
        }],
        author: [{
          name: 'CORAL編集部'
        }]
      }
    },
    {
      id: 5,
      title: { rendered: 'ヘルステック革命：医療の未来' },
      excerpt: { rendered: '<p>テクノロジーの進化により、医療分野でも大きな変革が起きています...</p>' },
      date: new Date(Date.now() - 345600000).toISOString(),
      link: '#',
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://picsum.photos/800/600?random=5'
        }],
        author: [{
          name: 'CORAL編集部'
        }]
      }
    },
    {
      id: 6,
      title: { rendered: 'グリーンエネルギーの新時代' },
      excerpt: { rendered: '<p>再生可能エネルギーの技術革新により、持続可能な社会の実現が加速しています...</p>' },
      date: new Date(Date.now() - 432000000).toISOString(),
      link: '#',
      _embedded: {
        'wp:featuredmedia': [{
          source_url: 'https://picsum.photos/800/600?random=6'
        }],
        author: [{
          name: 'CORAL編集部'
        }]
      }
    }
  ];

  const { per_page = '6' } = req.query;
  const limit = Math.min(parseInt(per_page as string), mockPosts.length);
  
  res.json(mockPosts.slice(0, limit));
});

export default router;