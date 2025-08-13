import { Article } from '../types/wordpress';

// モックデータ - WordPressが利用できない場合のフォールバック
export const mockArticles: Article[] = [
  {
    id: 1,
    slug: 'ai-reasoning-breakthrough-2025',
    title: 'AI推論の革命的進歩：2025年の展望',
    content: `
      <p>人工知能の推論能力が飛躍的に向上し、2025年は AI技術にとって記念すべき年となりそうです。</p>
      
      <h2>主要な進歩</h2>
      <ul>
        <li>大規模言語モデルの推論精度向上</li>
        <li>マルチモーダル AI の実用化</li>
        <li>エッジデバイスでのAI推論高速化</li>
      </ul>
      
      <p>これらの技術革新により、私たちの生活は大きく変わることでしょう。</p>
    `,
    excerpt: 'AI推論技術の革命的進歩について、2025年の展望を詳しく解説します。',
    date: '2025-01-15T10:00:00Z',
    modified: '2025-01-15T10:00:00Z',
    author: {
      id: 1,
      name: 'CORAL編集部',
      avatar: '/images/coral.png',
      bio: 'テクノロジーとイノベーションを追求する編集チーム',
    },
    featuredImage: {
      id: 1,
      url: '/images/ai.png',
      alt: 'AI技術のイメージ',
      sizes: {
        thumbnail: '/images/ai.png',
        medium: '/images/ai.png',
        large: '/images/ai.png',
        full: '/images/ai.png',
      },
    },
    categories: [
      { id: 1, name: 'Tech', slug: 'tech' },
    ],
    tags: [
      { id: 1, name: 'AI', slug: 'ai' },
      { id: 2, name: '機械学習', slug: 'machine-learning' },
      { id: 3, name: '2025年', slug: '2025' },
    ],
    readingTime: 5,
  },
  {
    id: 2,
    slug: 'meditation-science-2025',
    title: '瞑想の科学：現代社会でのマインドフルネス実践',
    content: `
      <p>現代の忙しい社会において、瞑想とマインドフルネスの重要性がますます注目されています。</p>
      
      <h2>科学的根拠</h2>
      <p>最新の脳科学研究により、瞑想が脳の構造と機能に与える positive な影響が明らかになっています。</p>
      
      <h2>実践方法</h2>
      <ol>
        <li>呼吸に集中する基本瞑想</li>
        <li>歩行瞑想</li>
        <li>ボディスキャン瞑想</li>
      </ol>
    `,
    excerpt: '瞑想とマインドフルネスの科学的効果と実践方法について解説します。',
    date: '2025-01-14T09:00:00Z',
    modified: '2025-01-14T09:00:00Z',
    author: {
      id: 2,
      name: '田中 瞑想',
      avatar: '/images/she.png',
      bio: 'マインドフルネス指導者・脳科学研究者',
    },
    featuredImage: {
      id: 2,
      url: '/images/cat.png',
      alt: '瞑想のイメージ',
      sizes: {
        thumbnail: '/images/cat.png',
        medium: '/images/cat.png',
        large: '/images/cat.png',
        full: '/images/cat.png',
      },
    },
    categories: [
      { id: 2, name: 'Spiritual', slug: 'spiritual' },
    ],
    tags: [
      { id: 4, name: '瞑想', slug: 'meditation' },
      { id: 5, name: 'マインドフルネス', slug: 'mindfulness' },
      { id: 6, name: '脳科学', slug: 'neuroscience' },
    ],
    readingTime: 7,
  },
  {
    id: 3,
    slug: 'future-music-technology',
    title: '音楽テクノロジーの未来：AIが作る新しい音楽体験',
    content: `
      <p>音楽業界もAI技術の波を受け、創作から配信まで革新的な変化を遂げています。</p>
      
      <h2>AI作曲の現状</h2>
      <p>現在のAI作曲技術は、人間のアーティストと協働する形で新しい音楽体験を提供しています。</p>
      
      <h2>没入型音楽体験</h2>
      <p>VR/ARを活用した没入型コンサートが、音楽の楽しみ方を根本的に変えています。</p>
    `,
    excerpt: 'AI技術が音楽業界にもたらす革新と、新しい音楽体験について探ります。',
    date: '2025-01-13T15:30:00Z',
    modified: '2025-01-13T15:30:00Z',
    author: {
      id: 3,
      name: '音楽太郎',
      avatar: '/images/man.png',
      bio: '音楽プロデューサー・テクノロジスト',
    },
    featuredImage: {
      id: 3,
      url: '/images/guer.png',
      alt: '音楽テクノロジー',
      sizes: {
        thumbnail: '/images/guer.png',
        medium: '/images/guer.png',
        large: '/images/guer.png',
        full: '/images/guer.png',
      },
    },
    categories: [
      { id: 3, name: 'Music', slug: 'music' },
      { id: 1, name: 'Tech', slug: 'tech' },
    ],
    tags: [
      { id: 1, name: 'AI', slug: 'ai' },
      { id: 7, name: '音楽', slug: 'music' },
      { id: 8, name: 'VR', slug: 'vr' },
    ],
    readingTime: 6,
  },
  {
    id: 4,
    slug: 'health-technology-integration',
    title: '健康管理の未来：ウェアラブルデバイスとAIの融合',
    content: `
      <p>ウェアラブルデバイスとAI技術の融合により、個人の健康管理が飛躍的に進化しています。</p>
      
      <h2>リアルタイム健康監視</h2>
      <p>24時間365日の生体情報監視により、病気の早期発見と予防が可能になっています。</p>
      
      <h2>パーソナライズド医療</h2>
      <p>個人の遺伝子情報とライフスタイルデータを組み合わせた、オーダーメイド医療の実現。</p>
    `,
    excerpt: 'ウェアラブルデバイスとAIが実現する、次世代の健康管理システムについて解説します。',
    date: '2025-01-12T11:00:00Z',
    modified: '2025-01-12T11:00:00Z',
    author: {
      id: 4,
      name: '健康花子',
      avatar: '/images/she2.png',
      bio: 'ヘルステック専門家・医師',
    },
    featuredImage: {
      id: 4,
      url: '/images/hose.png',
      alt: '健康テクノロジー',
      sizes: {
        thumbnail: '/images/hose.png',
        medium: '/images/hose.png',
        large: '/images/hose.png',
        full: '/images/hose.png',
      },
    },
    categories: [
      { id: 4, name: 'Health', slug: 'health' },
      { id: 1, name: 'Tech', slug: 'tech' },
    ],
    tags: [
      { id: 9, name: '健康', slug: 'health' },
      { id: 10, name: 'ウェアラブル', slug: 'wearable' },
      { id: 1, name: 'AI', slug: 'ai' },
    ],
    readingTime: 8,
  },
  {
    id: 5,
    slug: 'digital-art-revolution',
    title: 'デジタルアートの革命：NFTから生成AIまで',
    content: `
      <p>デジタルアート分野で起きている革命的な変化について、NFTから生成AIまで幅広く解説します。</p>
      
      <h2>NFTアートの現状</h2>
      <p>NFT技術により、デジタルアートの所有権と価値の概念が根本的に変わりました。</p>
      
      <h2>生成AI とアート</h2>
      <p>AIによる画像生成技術が、アーティストの創作プロセスに新たな可能性をもたらしています。</p>
    `,
    excerpt: 'NFTから生成AIまで、デジタルアート分野の革命的変化を詳しく解説します。',
    date: '2025-01-11T14:20:00Z',
    modified: '2025-01-11T14:20:00Z',
    author: {
      id: 5,
      name: 'アート次郎',
      avatar: '/images/man4.png',
      bio: 'デジタルアーティスト・NFTクリエイター',
    },
    featuredImage: {
      id: 5,
      url: '/images/gumi.png',
      alt: 'デジタルアート',
      sizes: {
        thumbnail: '/images/gumi.png',
        medium: '/images/gumi.png',
        large: '/images/gumi.png',
        full: '/images/gumi.png',
      },
    },
    categories: [
      { id: 5, name: 'Arts', slug: 'arts' },
    ],
    tags: [
      { id: 11, name: 'NFT', slug: 'nft' },
      { id: 12, name: 'デジタルアート', slug: 'digital-art' },
      { id: 1, name: 'AI', slug: 'ai' },
    ],
    readingTime: 6,
  },
  {
    id: 6,
    slug: 'future-politics-technology',
    title: 'テクノロジーが変える政治の未来',
    content: `
      <p>デジタル技術の進歩が政治システムと民主主義プロセスに与える影響について考察します。</p>
      
      <h2>デジタル民主主義</h2>
      <p>オンライン投票システムや市民参加プラットフォームが、政治参加の形を変えています。</p>
      
      <h2>AI と政策決定</h2>
      <p>ビッグデータとAI分析により、より効果的な政策立案が可能になっています。</p>
    `,
    excerpt: 'デジタル技術が政治システムと民主主義に与える影響について深く考察します。',
    date: '2025-01-10T16:45:00Z',
    modified: '2025-01-10T16:45:00Z',
    author: {
      id: 6,
      name: '政治三郎',
      avatar: '/images/man9.png',
      bio: '政治学者・テクノロジー政策専門家',
    },
    featuredImage: {
      id: 6,
      url: '/images/toudai.png',
      alt: '政治とテクノロジー',
      sizes: {
        thumbnail: '/images/toudai.png',
        medium: '/images/toudai.png',
        large: '/images/toudai.png',
        full: '/images/toudai.png',
      },
    },
    categories: [
      { id: 6, name: 'Politics', slug: 'politics' },
      { id: 1, name: 'Tech', slug: 'tech' },
    ],
    tags: [
      { id: 13, name: '政治', slug: 'politics' },
      { id: 14, name: '民主主義', slug: 'democracy' },
      { id: 15, name: 'デジタル化', slug: 'digitalization' },
    ],
    readingTime: 7,
  },
];

// カテゴリーとタグのモックデータ
export const mockCategories = [
  { id: 1, name: 'Tech', slug: 'tech', description: 'テクノロジー関連記事', count: 10 },
  { id: 2, name: 'Spiritual', slug: 'spiritual', description: 'スピリチュアル関連記事', count: 5 },
  { id: 3, name: 'Music', slug: 'music', description: '音楽関連記事', count: 8 },
  { id: 4, name: 'Health', slug: 'health', description: '健康関連記事', count: 6 },
  { id: 5, name: 'Arts', slug: 'arts', description: 'アート関連記事', count: 7 },
  { id: 6, name: 'Politics', slug: 'politics', description: '政治関連記事', count: 4 },
];

export const mockTags = [
  { id: 1, name: 'AI', slug: 'ai', description: '人工知能', count: 15 },
  { id: 2, name: '機械学習', slug: 'machine-learning', description: '', count: 8 },
  { id: 3, name: '2025年', slug: '2025', description: '', count: 12 },
  { id: 4, name: '瞑想', slug: 'meditation', description: '', count: 6 },
  { id: 5, name: 'マインドフルネス', slug: 'mindfulness', description: '', count: 5 },
  { id: 6, name: '脳科学', slug: 'neuroscience', description: '', count: 4 },
  { id: 7, name: '音楽', slug: 'music', description: '', count: 9 },
  { id: 8, name: 'VR', slug: 'vr', description: '仮想現実', count: 3 },
  { id: 9, name: '健康', slug: 'health', description: '', count: 7 },
  { id: 10, name: 'ウェアラブル', slug: 'wearable', description: '', count: 3 },
  { id: 11, name: 'NFT', slug: 'nft', description: '', count: 6 },
  { id: 12, name: 'デジタルアート', slug: 'digital-art', description: '', count: 5 },
  { id: 13, name: '政治', slug: 'politics', description: '', count: 4 },
  { id: 14, name: '民主主義', slug: 'democracy', description: '', count: 2 },
  { id: 15, name: 'デジタル化', slug: 'digitalization', description: '', count: 6 },
];