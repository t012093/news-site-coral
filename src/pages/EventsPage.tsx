import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockEvents, mockEventCategories, Event } from '../lib/mockData';
import { useState, useMemo } from 'react';

const Container = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.header`
  margin-bottom: 4rem;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgb(106, 90, 205) 0%, rgb(30, 144, 255) 100%);
  color: white;
  border-radius: 12px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
  line-height: 1.6;
`;

const SearchAndFilterSection = styled.div`
  margin-bottom: 3rem;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: var(--primary-color);
  border: 2px solid #2a2a2a;
  border-radius: 25px;
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(156, 124, 244, 0.2);
  }

  &::placeholder {
    color: var(--secondary-color);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--secondary-color);
  font-size: 1.2rem;
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SearchResultsInfo = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  color: var(--secondary-color);
  font-size: 0.9rem;
`;

const HighlightedText = styled.span`
  background-color: rgba(156, 124, 244, 0.3);
  color: var(--accent-color);
  font-weight: 600;
  padding: 0.1rem 0.2rem;
  border-radius: 3px;
`;

const FilterButton = styled(motion.button)<{ active: boolean }>`
  padding: 0.5rem 1.5rem;
  background: ${props => props.active ? 'var(--accent-color)' : 'var(--primary-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--accent-color)' : '#2a2a2a'};
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--accent-color);
    color: white;
  }
`;

const FeaturedSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--text-color);
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedEventCard = styled(motion.article)`
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const EventBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;

  ${FeaturedEventCard}:hover & {
    transform: scale(1.05);
  }
`;

const EventOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
`;

const EventCategory = styled.span`
  background-color: var(--accent-color);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const EventMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const EventDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.5;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled(motion.article)`
  background: var(--primary-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #2a2a2a;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventInfo = styled.div`
  margin-bottom: 1rem;
`;

const EventDate = styled.div`
  font-size: 0.9rem;
  color: var(--accent-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EventLocation = styled.div`
  font-size: 0.9rem;
  color: var(--secondary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LocationIcon = styled.span`
  font-size: 0.8rem;
`;

const EventFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #2a2a2a;
`;

const ParticipantInfo = styled.div`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const PriceInfo = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-color);
`;

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const featuredEvents = mockEvents.filter(event => event.featured);
  const regularEvents = mockEvents.filter(event => !event.featured);
  
  // 検索とフィルターのロジック
  const filteredEvents = useMemo(() => {
    let events = regularEvents;
    
    // カテゴリーフィルター
    if (selectedCategory !== 'All') {
      events = events.filter(event => event.category === selectedCategory);
    }
    
    // テキスト検索
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      events = events.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query)) ||
        event.organizer.name.toLowerCase().includes(query) ||
        (event.location.venue && event.location.venue.toLowerCase().includes(query))
      );
    }
    
    return events;
  }, [regularEvents, selectedCategory, searchQuery]);

  // 検索結果情報用の計算
  const searchResultsText = useMemo(() => {
    const totalResults = filteredEvents.length;
    const hasSearch = searchQuery.trim().length > 0;
    const hasFilter = selectedCategory !== 'All';
    
    if (hasSearch && hasFilter) {
      return `"${searchQuery}" の${selectedCategory}イベント検索結果: ${totalResults}件`;
    } else if (hasSearch) {
      return `"${searchQuery}" の検索結果: ${totalResults}件`;
    } else if (hasFilter) {
      return `${selectedCategory}イベント: ${totalResults}件`;
    } else {
      return `すべてのイベント: ${totalResults}件`;
    }
  }, [filteredEvents.length, searchQuery, selectedCategory]);

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  // テキストハイライト関数
  const highlightSearchQuery = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <HighlightedText key={index}>{part}</HighlightedText>
      ) : (
        part
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatPrice = (event: Event) => {
    if (event.price.isFree) return '無料';
    return `¥${event.price.amount.toLocaleString()}`;
  };

  return (
    <Container>
      <PageHeader>
        <PageTitle>Events & Community</PageTitle>
        <PageDescription>
          CORALコミュニティが主催する様々なイベントに参加して、
          新しい知識とつながりを発見しませんか？
        </PageDescription>
      </PageHeader>

      <SearchAndFilterSection>
        <SearchContainer>
          <SearchInputWrapper>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="イベント名、説明、タグで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <ClearButton onClick={handleSearchClear}>
                ✕
              </ClearButton>
            )}
          </SearchInputWrapper>
        </SearchContainer>

        <FilterSection>
          <FilterButton
            active={selectedCategory === 'All'}
            onClick={() => setSelectedCategory('All')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Events
          </FilterButton>
          {mockEventCategories.map((category) => (
            <FilterButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </FilterButton>
          ))}
          {(searchQuery || selectedCategory !== 'All') && (
            <FilterButton
              active={false}
              onClick={handleClearAllFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                background: 'transparent', 
                border: '1px solid var(--accent-color)',
                color: 'var(--accent-color)'
              }}
            >
              すべてクリア
            </FilterButton>
          )}
        </FilterSection>
      </SearchAndFilterSection>

      <FeaturedSection>
        <SectionTitle>注目のイベント</SectionTitle>
        <FeaturedGrid>
          {featuredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <FeaturedEventCard
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <EventBackground
                  style={{
                    backgroundImage: `url(${event.image})`,
                  }}
                />
                <EventOverlay>
                  <EventCategory>{event.category}</EventCategory>
                  <EventTitle>{event.title}</EventTitle>
                  <EventMeta>
                    <span>{formatDate(event.date)}</span>
                    <span>{event.startTime} - {event.endTime}</span>
                    <span>
                      {event.location.type === 'online' ? 'オンライン' : event.location.venue}
                    </span>
                  </EventMeta>
                  <EventDescription>
                    {event.description.length > 100 
                      ? `${event.description.substring(0, 100)}...` 
                      : event.description}
                  </EventDescription>
                </EventOverlay>
              </FeaturedEventCard>
            </Link>
          ))}
        </FeaturedGrid>
      </FeaturedSection>

      <section>
        <SectionTitle>
          {selectedCategory === 'All' ? 'すべてのイベント' : `${selectedCategory} イベント`}
        </SectionTitle>
        <SearchResultsInfo>{searchResultsText}</SearchResultsInfo>
        {filteredEvents.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            color: 'var(--secondary-color)' 
          }}>
            <h3 style={{ marginBottom: '1rem' }}>該当するイベントが見つかりませんでした</h3>
            <p style={{ marginBottom: '2rem' }}>検索条件を変更してもう一度お試しください</p>
            <FilterButton
              active={false}
              onClick={handleClearAllFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                background: 'var(--accent-color)', 
                color: 'white',
                border: 'none'
              }}
            >
              すべての条件をクリア
            </FilterButton>
          </div>
        ) : (
          <EventsGrid>
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <EventCard
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <EventImage src={event.image} alt={event.title} />
                <EventContent>
                  <EventCategory>{highlightSearchQuery(event.category, searchQuery)}</EventCategory>
                  <EventTitle>{highlightSearchQuery(event.title, searchQuery)}</EventTitle>
                  <EventInfo>
                    <EventDate>
                      {formatDate(event.date)} {event.startTime} - {event.endTime}
                    </EventDate>
                    <EventLocation>
                      <LocationIcon>
                        {event.location.type === 'online' ? '🌐' : '📍'}
                      </LocationIcon>
                      {event.location.type === 'online' 
                        ? 'オンライン開催' 
                        : event.location.venue}
                    </EventLocation>
                  </EventInfo>
                  <EventDescription>
                    {highlightSearchQuery(
                      event.description.length > 120 
                        ? `${event.description.substring(0, 120)}...` 
                        : event.description,
                      searchQuery
                    )}
                  </EventDescription>
                  <EventFooter>
                    <ParticipantInfo>
                      {event.participants.count}/{event.participants.maxCapacity} 参加予定
                    </ParticipantInfo>
                    <PriceInfo>{formatPrice(event)}</PriceInfo>
                  </EventFooter>
                </EventContent>
              </EventCard>
            </Link>
          ))}
          </EventsGrid>
        )}
      </section>
    </Container>
  );
};

export default EventsPage;