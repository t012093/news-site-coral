import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/auth';
import { mockEvents } from '../../lib/mockData';

const Container = styled.div`
  padding: 2rem 0;
  max-width: 1200px;
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
  grid-template-columns: 1fr 2fr;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProfileCard = styled(motion.div)`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  height: fit-content;
`;

const AvatarSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-color);
  margin-bottom: 1rem;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 0.3rem;
`;

const UserEmail = styled.p`
  color: var(--secondary-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const UserBio = styled.p`
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: left;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled(motion.section)`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionIcon = styled.span`
  font-size: 1.1rem;
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
    .max(500, '自己紹介は500文字以下で入力してください'),
});

type ProfileFormData = {
  displayName: string;
  bio: string;
};

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

  if (!user) return null;

  return (
    <Container>
      <PageHeader>
        <PageTitle>マイページ</PageTitle>
        <PageSubtitle>プロフィール情報とイベント履歴を管理</PageSubtitle>
      </PageHeader>

      <ContentGrid>
        <ProfileCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AvatarSection>
            <Avatar src={user.avatar || '/images/man.png'} alt={user.displayName} />
            <UserName>{user.displayName}</UserName>
            <UserEmail>{user.email}</UserEmail>
            <UserBio>{user.bio || '自己紹介が設定されていません'}</UserBio>
          </AvatarSection>
        </ProfileCard>

        <MainContent>
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SectionTitle>
              <SectionIcon>✏️</SectionIcon>
              プロフィール編集
            </SectionTitle>

            <Form onSubmit={handleSubmit(onSubmit)}>
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
          </Section>

          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SectionTitle>
              <SectionIcon>🎫</SectionIcon>
              参加イベント
            </SectionTitle>

            <EventsGrid>
              {userEvents.map((event) => (
                <EventCard key={event.id}>
                  <EventTitle>{event.title}</EventTitle>
                  <EventDate>
                    {new Date(event.date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </EventDate>
                  <EventStatus status={event.status}>
                    {event.status === 'upcoming' ? '参加予定' :
                     event.status === 'past' ? '参加済み' : '進行中'}
                  </EventStatus>
                </EventCard>
              ))}
            </EventsGrid>
          </Section>
        </MainContent>
      </ContentGrid>
    </Container>
  );
};

export default ProfilePage;