import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockEvents, Event } from '../lib/mockData';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  padding: 2rem 0;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-color);
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const HeroSection = styled.div`
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 3rem;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.7);
`;

const HeroOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
`;

const EventCategory = styled.span`
  background-color: var(--accent-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const EventMeta = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 1.1rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MainContent = styled.div``;

const EventDescription = styled.div`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
`;

const DescriptionText = styled.p`
  line-height: 1.7;
  color: var(--text-color);
  font-size: 1.1rem;
`;

const InfoSection = styled.div`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  margin-bottom: 2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const InfoIcon = styled.span`
  font-size: 1.2rem;
  margin-top: 0.2rem;
  min-width: 24px;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: var(--secondary-color);
  margin-bottom: 0.3rem;
`;

const InfoValue = styled.div`
  color: var(--text-color);
  font-weight: 500;
`;

const Sidebar = styled.div``;

const OrganizerCard = styled.div`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  margin-bottom: 2rem;
`;

const OrganizerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const OrganizerAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const OrganizerInfo = styled.div``;

const OrganizerName = styled.h3`
  color: var(--text-color);
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
`;

const OrganizerBio = styled.p`
  color: var(--secondary-color);
  font-size: 0.9rem;
`;

const ParticipantsCard = styled.div`
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  margin-bottom: 2rem;
`;

const ParticipantStats = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ParticipantCount = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-color);
`;

const ParticipantLabel = styled.div`
  color: var(--secondary-color);
  font-size: 0.9rem;
`;

const ParticipantAvatars = styled.div`
  display: flex;
  justify-content: center;
  gap: -0.5rem;
  margin-bottom: 1rem;
`;

const ParticipantAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  object-fit: cover;
  margin-left: -0.5rem;

  &:first-of-type {
    margin-left: 0;
  }
`;

const JoinButton = styled(motion.button)<{ disabled?: boolean }>`
  width: 100%;
  padding: 1rem;
  background: ${props => props.disabled ? '#666' : 'var(--accent-color)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-bottom: 1rem;
`;

const PriceInfo = styled.div`
  text-align: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const TagsSection = styled.div`
  margin-top: 2rem;
`;

const TagsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: rgba(156, 124, 244, 0.2);
  color: var(--accent-color);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
`;

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  
  const event = mockEvents.find((e) => e.slug === slug);

  if (!event) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h1>イベントが見つかりません</h1>
          <Link to="/events">イベント一覧に戻る</Link>
        </div>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatPrice = (event: Event) => {
    if (event.price.isFree) return '無料';
    return `¥${event.price.amount.toLocaleString()}`;
  };

  const isFull = event.participants.count >= event.participants.maxCapacity;

  const handleJoinEvent = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${slug}` } });
      return;
    }
    setIsJoined(true);
  };

  const handleCancelJoin = () => {
    setIsJoined(false);
  };

  const getJoinButtonText = () => {
    if (!isAuthenticated) {
      return 'ログインして参加';
    }
    if (isJoined) {
      return '参加申し込み完了';
    }
    if (isFull) {
      return '満員御礼';
    }
    return 'このイベントに参加する';
  };

  const getJoinButtonAction = () => {
    if (!isAuthenticated || isFull) {
      return handleJoinEvent;
    }
    return isJoined ? handleCancelJoin : handleJoinEvent;
  };

  return (
    <Container>
      <BackButton to="/events">
        ← イベント一覧に戻る
      </BackButton>

      <HeroSection>
        <HeroBackground
          style={{
            backgroundImage: `url(${event.image})`,
          }}
        />
        <HeroOverlay>
          <EventCategory>{event.category}</EventCategory>
          <EventTitle>{event.title}</EventTitle>
          <EventMeta>
            <span>{formatDate(event.date)}</span>
            <span>{event.startTime} - {event.endTime}</span>
            <span>
              {event.location.type === 'online' ? 'オンライン開催' : event.location.venue}
            </span>
          </EventMeta>
        </HeroOverlay>
      </HeroSection>

      <ContentGrid>
        <MainContent>
          <EventDescription>
            <SectionTitle>イベントについて</SectionTitle>
            <DescriptionText>{event.description}</DescriptionText>
          </EventDescription>

          <InfoSection>
            <SectionTitle>詳細情報</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoIcon>📅</InfoIcon>
                <InfoContent>
                  <InfoLabel>日時</InfoLabel>
                  <InfoValue>
                    {formatDate(event.date)} {event.startTime} - {event.endTime}
                  </InfoValue>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon>
                  {event.location.type === 'online' ? '🌐' : '📍'}
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>開催場所</InfoLabel>
                  <InfoValue>
                    {event.location.type === 'online' 
                      ? 'オンライン開催（参加URLは後日送付）'
                      : `${event.location.venue}`}
                  </InfoValue>
                  {event.location.address && (
                    <InfoValue style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.3rem' }}>
                      {event.location.address}
                    </InfoValue>
                  )}
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIcon>👥</InfoIcon>
                <InfoContent>
                  <InfoLabel>定員</InfoLabel>
                  <InfoValue>{event.participants.maxCapacity}名</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIcon>💰</InfoIcon>
                <InfoContent>
                  <InfoLabel>参加費</InfoLabel>
                  <InfoValue>{formatPrice(event)}</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          {event.tags.length > 0 && (
            <TagsSection>
              <SectionTitle>タグ</SectionTitle>
              <TagsGrid>
                {event.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagsGrid>
            </TagsSection>
          )}
        </MainContent>

        <Sidebar>
          <OrganizerCard>
            <SectionTitle>主催者</SectionTitle>
            <OrganizerHeader>
              <OrganizerAvatar src={event.organizer.avatar} alt={event.organizer.name} />
              <OrganizerInfo>
                <OrganizerName>{event.organizer.name}</OrganizerName>
              </OrganizerInfo>
            </OrganizerHeader>
            <OrganizerBio>{event.organizer.bio}</OrganizerBio>
          </OrganizerCard>

          <ParticipantsCard>
            <SectionTitle>参加者</SectionTitle>
            <ParticipantStats>
              <ParticipantCount>
                {event.participants.count}/{event.participants.maxCapacity}
              </ParticipantCount>
              <ParticipantLabel>名が参加予定</ParticipantLabel>
            </ParticipantStats>
            
            {event.participants.avatars.length > 0 && (
              <ParticipantAvatars>
                {event.participants.avatars.map((avatar, index) => (
                  <ParticipantAvatar key={index} src={avatar} alt="参加者" />
                ))}
              </ParticipantAvatars>
            )}

            <PriceInfo>{formatPrice(event)}</PriceInfo>
            
            <JoinButton
              disabled={isFull && isAuthenticated}
              whileHover={{ scale: (isFull && isAuthenticated) ? 1 : 1.02 }}
              whileTap={{ scale: (isFull && isAuthenticated) ? 1 : 0.98 }}
              onClick={getJoinButtonAction()}
            >
              {getJoinButtonText()}
            </JoinButton>

            {isJoined && (
              <JoinButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelJoin}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid var(--accent-color)',
                  color: 'var(--accent-color)'
                }}
              >
                参加をキャンセル
              </JoinButton>
            )}
            
            {isFull && (
              <div style={{ 
                textAlign: 'center', 
                fontSize: '0.9rem', 
                color: 'var(--secondary-color)' 
              }}>
                キャンセル待ちは受け付けておりません
              </div>
            )}
          </ParticipantsCard>
        </Sidebar>
      </ContentGrid>
    </Container>
  );
};

export default EventDetailPage;