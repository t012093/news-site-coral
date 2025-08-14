import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/auth';
import { mockEvents } from '../../lib/mockData';

const Container = styled.div`
  padding: 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.header`
  margin-bottom: 3rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  color: var(--secondary-color);
  font-size: 1.1rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Sidebar = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: sticky;
  top: 2rem;
  height: fit-content;
  
  @media (max-width: 1024px) {
    position: static;
  }
`;

const UserInfoCard = styled.div`
  background: var(--primary-color);
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
  border: 1px solid #2a2a2a;
  border-bottom: none;
  text-align: center;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-color);
  margin-bottom: 0.75rem;
`;

const UserName = styled.h2`
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  text-align: center;
`;

const UserEmail = styled.p`
  color: var(--secondary-color);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const UserBio = styled.p`
  color: var(--text-color);
  font-size: 0.85rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1rem;
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 8px;
  margin-top: 1rem;
`;

const QuickStat = styled.div`
  text-align: center;
`;

const QuickStatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 0.2rem;
`;

const QuickStatLabel = styled.div`
  font-size: 0.7rem;
  color: var(--secondary-color);
`;

const SidebarMenu = styled.div`
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
  border-top: none;
  border-radius: 0 0 12px 12px;
`;

const MenuItem = styled.button<{ active: boolean }>`
  width: 100%;
  padding: 1rem 1.5rem;
  background: ${props => props.active ? 'rgba(156, 124, 244, 0.2)' : 'transparent'};
  color: ${props => props.active ? 'var(--accent-color)' : 'var(--text-color)'};
  border: none;
  border-bottom: 1px solid #2a2a2a;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  
  &:hover {
    background: rgba(156, 124, 244, 0.1);
    color: var(--accent-color);
  }
  
  &:last-child {
    border-bottom: none;
    border-radius: 0 0 12px 12px;
  }
`;

const MenuIcon = styled.span`
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
`;

const MainContent = styled.div`
  background: var(--primary-color);
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  min-height: 700px;
`;

const ContentHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #2a2a2a;
`;

const ContentTitle = styled.h2`
  color: var(--text-color);
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ContentSubtitle = styled.p`
  color: var(--secondary-color);
  font-size: 1rem;
  margin: 0;
`;

const ContentBody = styled.div`
  padding: 2rem;
`;

const SectionCard = styled.div`
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #404040;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text-color);
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  background: #2a2a2a;
  border: 1px solid ${props => props.hasError ? '#ff6b6b' : '#404040'};
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(156, 124, 244, 0.2);
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  background: #2a2a2a;
  border: 1px solid ${props => props.hasError ? '#ff6b6b' : '#404040'};
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(156, 124, 244, 0.2);
  }
`;

const ErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 0.8rem;
`;

const SaveButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;

  &:hover {
    background: #8b5fe6;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled.div`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #404040;
`;

const EventTitle = styled.h4`
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const EventDate = styled.p`
  color: var(--accent-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const EventStatus = styled.span<{ status: string }>`
  background: ${props => 
    props.status === 'upcoming' ? 'rgba(34, 197, 94, 0.2)' :
    props.status === 'past' ? 'rgba(156, 163, 175, 0.2)' :
    'rgba(251, 191, 36, 0.2)'
  };
  color: ${props => 
    props.status === 'upcoming' ? '#22c55e' :
    props.status === 'past' ? '#9ca3af' :
    '#fbbf24'
  };
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const schema = yup.object().shape({
  displayName: yup
    .string()
    .min(2, '表示名は2文字以上で入力してください')
    .max(50, '表示名は50文字以下で入力してください')
    .required('表示名は必須です'),
  bio: yup
    .string()
    .max(500, '自己紹介は500文字以下で入力してください')
    .optional(),
});

type ProfileFormData = {
  displayName: string;
  bio?: string;
};

type TabType = 'overview' | 'profile' | 'membership' | 'payments' | 'activity' | 'bookmarks' | 'notifications' | 'security';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
    },
  });

  // ユーザーが参加したイベント（モックデータ）
  const userEvents = mockEvents.slice(0, 3).map(event => ({
    ...event,
    status: Math.random() > 0.5 ? 'upcoming' : 'past' as const,
  }));

  const tabs = [
    { id: 'overview', label: '概要', icon: '📊' },
    { id: 'profile', label: 'プロフィール', icon: '👤' },
    { id: 'membership', label: '会員情報', icon: '🎫' },
    { id: 'payments', label: '支払い・請求', icon: '💳' },
    { id: 'activity', label: '活動履歴', icon: '📋' },
    { id: 'bookmarks', label: 'お気に入り', icon: '⭐' },
    { id: 'notifications', label: '通知設定', icon: '🔔' },
    { id: 'security', label: 'セキュリティ', icon: '🔒' },
  ] as const;

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
    } catch (error) {
      // エラーハンドリングはAuthContextで行われる
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <ContentHeader>
              <ContentTitle>
                <MenuIcon>{currentTab?.icon}</MenuIcon>
                {currentTab?.label}
              </ContentTitle>
              <ContentSubtitle>アカウントの概要と最新の活動状況</ContentSubtitle>
            </ContentHeader>
            <ContentBody>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <SectionCard>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎯</span>最近の活動
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-color)' }}>参加中のプロジェクト</span>
                      <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>2件</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-color)' }}>今月の活動時間</span>
                      <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>8時間</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-color)' }}>貢献度スコア</span>
                      <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>85点</span>
                    </div>
                  </div>
                </SectionCard>
                <SectionCard>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎫</span>会員ステータス
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-color)' }}>会員種別</span>
                      <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>一般会員</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-color)' }}>有効期限</span>
                      <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>2025/03/31</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-color)' }}>更新まで</span>
                      <span style={{ color: '#22c55e', fontWeight: '600' }}>107日</span>
                    </div>
                  </div>
                </SectionCard>
                <SectionCard>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📅</span>次回予定
                  </h4>
                  <div style={{ background: 'rgba(156, 124, 244, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(156, 124, 244, 0.3)' }}>
                    <p style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '0.5rem' }}>AI創作ワークショップ</p>
                    <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>2024年12月20日 (金) 14:00-17:00</p>
                    <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>📍 オンライン（Zoom）</p>
                  </div>
                </SectionCard>
              </div>
            </ContentBody>
          </>
        );
      case 'profile':
        return (
          <>
            <ContentHeader>
              <ContentTitle>
                <MenuIcon>{currentTab?.icon}</MenuIcon>
                {currentTab?.label}
              </ContentTitle>
              <ContentSubtitle>基本情報とプロフィール設定を管理</ContentSubtitle>
            </ContentHeader>
            <ContentBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem' }}>基本情報</h4>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <FormRow>
                        <FormGroup>
                          <Label>表示名</Label>
                          <Input
                            hasError={!!errors.displayName}
                            {...register('displayName')}
                          />
                          {errors.displayName && (
                            <ErrorMessage>{errors.displayName.message}</ErrorMessage>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Label>メールアドレス</Label>
                          <Input value={user?.email} disabled style={{ opacity: 0.7 }} />
                        </FormGroup>
                      </FormRow>
                      
                      <FormGroup>
                        <Label>自己紹介</Label>
                        <TextArea
                          placeholder="あなたについて教えてください..."
                          hasError={!!errors.bio}
                          {...register('bio')}
                        />
                        {errors.bio && (
                          <ErrorMessage>{errors.bio.message}</ErrorMessage>
                        )}
                      </FormGroup>
                      
                      <SaveButton
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoading ? '保存中...' : '変更を保存'}
                      </SaveButton>
                    </Form>
                  </SectionCard>
                </div>
                
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>プロフィール画像</h4>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <Avatar src={user?.avatar || '/images/man.png'} alt={user?.displayName} style={{ width: '120px', height: '120px' }} />
                    </div>
                    <button style={{ width: '100%', padding: '0.75rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                      画像を変更
                    </button>
                  </SectionCard>
                  
                  <SectionCard style={{ marginTop: '1rem' }}>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>アカウント統計</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>参加日</span>
                        <span style={{ color: 'var(--text-color)', fontWeight: '600' }}>2024/04/01</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>ログイン回数</span>
                        <span style={{ color: 'var(--text-color)', fontWeight: '600' }}>47回</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>最終ログイン</span>
                        <span style={{ color: 'var(--text-color)', fontWeight: '600' }}>今日</span>
                      </div>
                    </div>
                  </SectionCard>
                </div>
              </div>
            </ContentBody>
          </>
        );
      case 'membership':
        return (
          <>
            <ContentHeader>
              <ContentTitle>
                <MenuIcon>{currentTab?.icon}</MenuIcon>
                {currentTab?.label}
              </ContentTitle>
              <ContentSubtitle>会員ステータスと特典の詳細</ContentSubtitle>
            </ContentHeader>
            <ContentBody>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>👤</span>会員ステータス
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>会員ID</p>
                        <p style={{ color: 'var(--text-color)', fontWeight: '600', fontSize: '1.1rem' }}>NPO-2024-001</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>会員種別</p>
                        <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600' }}>一般会員</span>
                      </div>
                      <div>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>加入日</p>
                        <p style={{ color: 'var(--text-color)', fontWeight: '600' }}>2024年4月1日</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>有効期限</p>
                        <p style={{ color: 'var(--text-color)', fontWeight: '600' }}>2025年3月31日</p>
                      </div>
                    </div>
                  </SectionCard>
                  
                  <SectionCard style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🎁</span>会員特典
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: 'rgba(156, 124, 244, 0.1)', borderRadius: '8px', border: '1px solid rgba(156, 124, 244, 0.3)' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎫</div>
                        <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>イベント割引</h5>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>全イベント参加費10%OFF</p>
                      </div>
                      <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📧</div>
                        <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>ニュースレター</h5>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>月刊ニュースレター配信</p>
                      </div>
                      <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
                        <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>限定イベント</h5>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>会員限定イベント参加権</p>
                      </div>
                      <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📜</div>
                        <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>活動証明書</h5>
                        <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>ボランティア証明書発行</p>
                      </div>
                    </div>
                  </SectionCard>
                </div>
                
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>⏱️</span>更新情報
                    </h4>
                    <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '700', color: '#22c55e', marginBottom: '0.5rem' }}>107</div>
                      <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>更新まであと 日</div>
                    </div>
                    <button style={{ width: '100%', padding: '0.75rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                      更新手続きを開始
                    </button>
                  </SectionCard>
                  
                  <SectionCard style={{ marginTop: '1rem' }}>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>会員ランク</h4>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⭐</div>
                      <div style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '0.5rem' }}>ブロンズ会員</div>
                      <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>次のランクまで：15ポイント</div>
                      <div style={{ width: '100%', height: '8px', background: '#2a2a2a', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
                        <div style={{ width: '60%', height: '100%', background: 'var(--accent-color)' }}></div>
                      </div>
                    </div>
                  </SectionCard>
                </div>
              </div>
            </ContentBody>
          </>
        );
      case 'payments':
        return (
          <>
            <ContentHeader>
              <ContentTitle>
                <MenuIcon>{currentTab?.icon}</MenuIcon>
                {currentTab?.label}
              </ContentTitle>
              <ContentSubtitle>支払い方法と請求履歴の管理</ContentSubtitle>
            </ContentHeader>
            <ContentBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>💳</span>登録済み支払い方法
                    </h4>
                    <div style={{ padding: '1.5rem', background: '#1a1a1a', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #404040' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <p style={{ color: 'var(--text-color)', fontWeight: '600' }}>💳 VISA **** **** **** 1234</p>
                          <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>有効期限: 12/27</p>
                        </div>
                        <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>デフォルト</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>編集</button>
                        <button style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>削除</button>
                      </div>
                    </div>
                    <button style={{ width: '100%', padding: '0.75rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>+ 支払い方法を追加</button>
                  </SectionCard>
                </div>
                
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📊</span>支払い統計
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22c55e', marginBottom: '0.5rem' }}>¥15,000</div>
                        <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>今年の総支払額</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(156, 124, 244, 0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>¥10,000</div>
                        <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>寄付控除対象額</div>
                      </div>
                    </div>
                    <button style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>領収書をダウンロード</button>
                  </SectionCard>
                </div>
              </div>
              
              <SectionCard style={{ marginTop: '2rem' }}>
                <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📜</span>支払い履歴
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#2a2a2a', borderRadius: '8px' }}>
                    <div>
                      <p style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '0.25rem' }}>年会費 2024年度</p>
                      <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>2024/04/01 - VISA *1234</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'var(--text-color)', fontWeight: '600' }}>¥5,000</p>
                      <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}>完了</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#2a2a2a', borderRadius: '8px' }}>
                    <div>
                      <p style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '0.25rem' }}>寄付金</p>
                      <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>2024/06/15 - VISA *1234</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'var(--text-color)', fontWeight: '600' }}>¥10,000</p>
                      <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}>完了</span>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </ContentBody>
          </>
        );
      case 'activity':
        return (
          <>
            <ContentHeader>
              <ContentTitle>
                <MenuIcon>{currentTab?.icon}</MenuIcon>
                {currentTab?.label}
              </ContentTitle>
              <ContentSubtitle>プロジェクト、イベント、ボランティア活動の記録</ContentSubtitle>
            </ContentHeader>
            <ContentBody>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🎫</span>参加イベント
                    </h4>
                    <EventsGrid style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
                      {userEvents.map((event) => (
                        <EventCard key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <EventTitle style={{ marginBottom: '0.25rem' }}>{event.title}</EventTitle>
                            <EventDate style={{ marginBottom: '0.5rem' }}>
                              {new Date(event.date).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </EventDate>
                          </div>
                          <EventStatus status={event.status}>
                            {event.status === 'upcoming' ? '参加予定' :
                             event.status === 'past' ? '参加済み' : '進行中'}
                          </EventStatus>
                        </EventCard>
                      ))}
                    </EventsGrid>
                  </SectionCard>
                  
                  <SectionCard style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>💼</span>参加プロジェクト
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ padding: '1.5rem', background: '#2a2a2a', borderRadius: '8px', border: '1px solid #404040' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                          <div>
                            <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>国際交流プラットフォーム開発</h5>
                            <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>2024/04/01 - 進行中</p>
                          </div>
                          <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>参加中</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-color)' }}>15h</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>貢献時間</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-color)' }}>85</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>貢献度</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ background: 'rgba(156, 124, 244, 0.1)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>React</span>
                          <span style={{ background: 'rgba(156, 124, 244, 0.1)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>TypeScript</span>
                          <span style={{ background: 'rgba(156, 124, 244, 0.1)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>UI/UX</span>
                        </div>
                      </div>
                      
                      <div style={{ padding: '1.5rem', background: '#2a2a2a', borderRadius: '8px', border: '1px solid #404040' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                          <div>
                            <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>AI創作支援プラットフォーム</h5>
                            <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>2024/02/15 - 2024/03/30</p>
                          </div>
                          <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>完了</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-color)' }}>32h</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>貢献時間</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-color)' }}>95</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>貢献度</div>
                          </div>
                        </div>
                        <button style={{ padding: '0.5rem 1rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>📜 証明書ダウンロード</button>
                      </div>
                    </div>
                  </SectionCard>
                </div>
                
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📈</span>活動統計
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#22c55e', marginBottom: '0.5rem' }}>47</div>
                        <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>総貢献時間</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(156, 124, 244, 0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>5</div>
                        <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>参加プロジェクト数</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24', marginBottom: '0.5rem' }}>12</div>
                        <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>参加イベント数</div>
                      </div>
                    </div>
                  </SectionCard>
                  
                  <SectionCard style={{ marginTop: '1rem' }}>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>スキル習得</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ background: 'rgba(156, 124, 244, 0.1)', color: 'var(--accent-color)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid rgba(156, 124, 244, 0.3)' }}>React</span>
                      <span style={{ background: 'rgba(156, 124, 244, 0.1)', color: 'var(--accent-color)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid rgba(156, 124, 244, 0.3)' }}>TypeScript</span>
                      <span style={{ background: 'rgba(156, 124, 244, 0.1)', color: 'var(--accent-color)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid rgba(156, 124, 244, 0.3)' }}>UI/UX</span>
                      <span style={{ background: 'rgba(156, 124, 244, 0.1)', color: 'var(--accent-color)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid rgba(156, 124, 244, 0.3)' }}>プロジェクト管理</span>
                    </div>
                  </SectionCard>
                </div>
              </div>
            </ContentBody>
          </>
        );
      case 'bookmarks':
        return (
          <>
            <ContentHeader>
              <ContentTitle>
                <MenuIcon>{currentTab?.icon}</MenuIcon>
                {currentTab?.label}
              </ContentTitle>
              <ContentSubtitle>保存したコンテンツとフォロー中の項目</ContentSubtitle>
            </ContentHeader>
            <ContentBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <SectionCard>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📚</span>保存した記事
                  </h4>
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--secondary-color)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📖</div>
                    <p>保存した記事はまだありません</p>
                    <p style={{ fontSize: '0.9rem' }}>気になる記事を保存して後で読み返しましょう</p>
                  </div>
                </SectionCard>
                
                <SectionCard>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>💼</span>フォロー中のプロジェクト
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: '#2a2a2a', borderRadius: '8px', border: '1px solid #404040' }}>
                      <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>国際交流プラットフォーム開発</h5>
                      <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>進行状況: 35%完了</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}>参加中</span>
                        <button style={{ background: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>詳細を見る</button>
                      </div>
                    </div>
                    
                    <div style={{ padding: '1rem', background: '#2a2a2a', borderRadius: '8px', border: '1px solid #404040' }}>
                      <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>AI創作支援プラットフォーム</h5>
                      <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>関心度: 高</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ background: 'rgba(156, 124, 244, 0.2)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}>フォロー中</span>
                        <button style={{ background: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>詳細を見る</button>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>
              
              <SectionCard style={{ marginTop: '2rem' }}>
                <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎫</span>関心のあるイベント
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1.5rem', background: '#2a2a2a', borderRadius: '8px', border: '1px solid #404040' }}>
                    <h5 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>AI創作ワークショップ</h5>
                    <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '1rem' }}>2024/12/20 (金) 14:00-17:00</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ flex: 1, padding: '0.5rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>参加申し込み</button>
                      <button style={{ padding: '0.5rem', background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>💔</button>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </ContentBody>
          </>
        );
      case 'notifications':
        return (
          <>
            <ContentHeader>
              <ContentTitle>
                <MenuIcon>{currentTab?.icon}</MenuIcon>
                {currentTab?.label}
              </ContentTitle>
              <ContentSubtitle>通知とアプリケーションの設定</ContentSubtitle>
            </ContentHeader>
            <ContentBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📧</span>メール通知
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#2a2a2a', borderRadius: '8px' }}>
                        <div>
                          <p style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '0.25rem' }}>イベント通知</p>
                          <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>新しいイベントや申し込み締切の通知</p>
                        </div>
                        <input type="checkbox" defaultChecked />
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#2a2a2a', borderRadius: '8px' }}>
                        <div>
                          <p style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '0.25rem' }}>ニューズレター</p>
                          <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>月刊ニューズレターと活動報告</p>
                        </div>
                        <input type="checkbox" defaultChecked />
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#2a2a2a', borderRadius: '8px' }}>
                        <div>
                          <p style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '0.25rem' }}>プロジェクト更新</p>
                          <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>参加プロジェクトの進捗や更新情報</p>
                        </div>
                        <input type="checkbox" />
                      </div>
                    </div>
                  </SectionCard>
                </div>
                
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>⚙️</span>表示設定
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <label style={{ color: 'var(--text-color)', marginBottom: '0.75rem', display: 'block', fontWeight: '600' }}>言語</label>
                        <select style={{ width: '100%', padding: '0.75rem', background: '#2a2a2a', color: 'var(--text-color)', border: '1px solid #404040', borderRadius: '8px' }}>
                          <option value="ja">🇯🇵 日本語</option>
                          <option value="en">🇺🇸 English</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ color: 'var(--text-color)', marginBottom: '0.75rem', display: 'block', fontWeight: '600' }}>テーマ</label>
                        <select style={{ width: '100%', padding: '0.75rem', background: '#2a2a2a', color: 'var(--text-color)', border: '1px solid #404040', borderRadius: '8px' }}>
                          <option value="dark">🌙 ダークモード</option>
                          <option value="light">☀️ ライトモード</option>
                          <option value="auto">🔄 システム設定に従う</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ color: 'var(--text-color)', marginBottom: '0.75rem', display: 'block', fontWeight: '600' }}>タイムゾーン</label>
                        <select style={{ width: '100%', padding: '0.75rem', background: '#2a2a2a', color: 'var(--text-color)', border: '1px solid #404040', borderRadius: '8px' }}>
                          <option value="Asia/Tokyo">🗾 日本標準時 (JST)</option>
                          <option value="UTC">🌍 協定世界時 (UTC)</option>
                        </select>
                      </div>
                    </div>
                  </SectionCard>
                </div>
              </div>
            </ContentBody>
          </>
        );
      case 'security':
        return (
          <>
            <ContentHeader>
              <ContentTitle>
                <MenuIcon>{currentTab?.icon}</MenuIcon>
                {currentTab?.label}
              </ContentTitle>
              <ContentSubtitle>アカウントセキュリティとプライバシー設定</ContentSubtitle>
            </ContentHeader>
            <ContentBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🔑</span>パスワード
                    </h4>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        最終変更: 2024年4月1日<br/>
                        強力なパスワードで保護されています
                      </p>
                      <button style={{ width: '100%', padding: '0.75rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                        パスワードを変更
                      </button>
                    </div>
                  </SectionCard>

                  <SectionCard style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🛡️</span>2要素認証
                    </h4>
                    <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>🚫</div>
                        <div>
                          <p style={{ color: '#ef4444', fontWeight: '600', marginBottom: '0.25rem' }}>2要素認証が無効です</p>
                          <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>アカウントのセキュリティを向上させましょう</p>
                        </div>
                      </div>
                      <button style={{ width: '100%', padding: '0.75rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                        2要素認証を有効にする
                      </button>
                    </div>
                    <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>
                      📱 SMS、認証アプリ、またはハードウェアキーを使用して追加のセキュリティ層を提供します。
                    </p>
                  </SectionCard>
                </div>

                <div>
                  <SectionCard>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📱</span>ログインセッション
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: '#2a2a2a', borderRadius: '8px', border: '1px solid #404040' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div>
                            <p style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '0.25rem' }}>🌐 Chrome (Windows)</p>
                            <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>東京, 日本 • 現在</p>
                            <p style={{ color: 'var(--secondary-color)', fontSize: '0.8rem' }}>IP: 192.168.1.1</p>
                          </div>
                          <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>現在のセッション</span>
                        </div>
                      </div>
                      
                      <div style={{ padding: '1rem', background: '#2a2a2a', borderRadius: '8px', border: '1px solid #404040' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div>
                            <p style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '0.25rem' }}>📱 Safari (iPhone)</p>
                            <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>東京, 日本 • 3時間前</p>
                            <p style={{ color: 'var(--secondary-color)', fontSize: '0.8rem' }}>IP: 192.168.1.2</p>
                          </div>
                          <button style={{ background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>終了</button>
                        </div>
                      </div>
                    </div>
                    
                    <button style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '1rem' }}>
                      すべてのセッションを終了
                    </button>
                  </SectionCard>

                  <SectionCard style={{ marginTop: '1rem' }}>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🔒</span>プライバシー
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <button style={{ padding: '0.75rem', background: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }}>
                        📥 データをダウンロード
                      </button>
                      <button style={{ padding: '0.75rem', background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }}>
                        🗑️ アカウントを削除
                      </button>
                    </div>
                  </SectionCard>
                </div>
              </div>
            </ContentBody>
          </>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <Container>
      <PageHeader>
        <PageTitle>アカウント管理</PageTitle>
        <PageSubtitle>プロフィール情報、会員情報、設定を管理</PageSubtitle>
      </PageHeader>

      <ContentGrid>
        <Sidebar
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UserInfoCard>
            <AvatarSection>
              <Avatar src={user.avatar || '/images/man.png'} alt={user.displayName} />
              <UserName>{user.displayName}</UserName>
              <UserEmail>{user.email}</UserEmail>
              <UserBio>{user.bio || '自己紹介が設定されていません'}</UserBio>
            </AvatarSection>
            
            <QuickStats>
              <QuickStat>
                <QuickStatValue>2</QuickStatValue>
                <QuickStatLabel>プロジェクト</QuickStatLabel>
              </QuickStat>
              <QuickStat>
                <QuickStatValue>8h</QuickStatValue>
                <QuickStatLabel>今月の活動</QuickStatLabel>
              </QuickStat>
              <QuickStat>
                <QuickStatValue>85</QuickStatValue>
                <QuickStatLabel>貢献スコア</QuickStatLabel>
              </QuickStat>
              <QuickStat>
                <QuickStatValue>107</QuickStatValue>
                <QuickStatLabel>更新まで</QuickStatLabel>
              </QuickStat>
            </QuickStats>
          </UserInfoCard>
          
          <SidebarMenu>
            {tabs.map((tab) => (
              <MenuItem
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                <MenuIcon>{tab.icon}</MenuIcon>
                {tab.label}
              </MenuItem>
            ))}
          </SidebarMenu>
        </Sidebar>

        <MainContent>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </motion.div>
        </MainContent>
      </ContentGrid>
    </Container>
  );
};

export default ProfilePage;