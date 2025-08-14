import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, addMonths, subMonths, addDays, subDays, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarEvent } from '../../types/shift';

interface InteractiveCalendarProps {
  view: 'month' | 'week' | 'day';
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const CalendarContainer = styled.div`
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
`;

const NavigationButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #3a3a3a;
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #3a3a3a;
    border-color: var(--accent-color);
  }
`;

const MonthTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  flex: 1;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
`;

const WeekDayHeader = styled.div`
  background: var(--primary-color);
  padding: 12px 8px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-color);
  border-bottom: 1px solid #2a2a2a;
`;

const DayCell = styled(motion.div)<{ 
  isCurrentMonth: boolean; 
  isToday: boolean; 
  hasEvents: boolean;
}>`
  background: var(--primary-color);
  min-height: 80px;
  padding: 8px;
  cursor: pointer;
  position: relative;
  opacity: ${props => props.isCurrentMonth ? 1 : 0.4};
  
  &:hover {
    background: #2a2a2a;
  }
  
  ${props => props.isToday && `
    background: linear-gradient(135deg, var(--accent-color)20, var(--primary-color));
    border: 2px solid var(--accent-color);
  `}
`;

const DayNumber = styled.div<{ isToday: boolean }>`
  font-size: 0.9rem;
  font-weight: ${props => props.isToday ? '700' : '500'};
  color: ${props => props.isToday ? 'var(--accent-color)' : 'var(--text-color)'};
  margin-bottom: 4px;
`;

const EventDot = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  background: ${props => props.color};
  border-radius: 50%;
  margin: 2px;
`;

const EventsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 4px;
`;

const EventPreview = styled(motion.div)<{ color: string }>`
  font-size: 0.7rem;
  padding: 2px 4px;
  background: ${props => props.color}20;
  color: ${props => props.color};
  border-radius: 3px;
  border-left: 2px solid ${props => props.color};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.color}40;
  }
`;

const WeekView = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 1px;
  background: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
`;

const TimeSlot = styled.div`
  background: var(--primary-color);
  padding: 8px;
  font-size: 0.8rem;
  color: var(--text-color);
  text-align: center;
  border-right: 1px solid #2a2a2a;
`;

const HourSlot = styled.div`
  background: var(--primary-color);
  min-height: 60px;
  padding: 4px;
  border-bottom: 1px solid #2a2a2a;
  position: relative;
  cursor: pointer;
  
  &:hover {
    background: #2a2a2a;
  }
`;

const DayView = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  overflow-y: auto;
`;

const DayHeader = styled.div`
  background: var(--primary-color);
  padding: 16px;
  border-bottom: 2px solid var(--accent-color);
  text-align: center;
`;

const DayTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--text-color);
  margin: 0;
`;

const DayDate = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 4px 0 0 0;
`;

const TimelineContainer = styled.div`
  flex: 1;
  display: flex;
`;

const TimeSidebar = styled.div`
  width: 80px;
  background: var(--primary-color);
  border-right: 1px solid #2a2a2a;
`;

const DayContent = styled.div`
  flex: 1;
  background: var(--primary-color);
  position: relative;
`;

const TimelineSlot = styled.div`
  height: 60px;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const DayEventSlot = styled.div`
  height: 60px;
  border-bottom: 1px solid #2a2a2a;
  position: relative;
  cursor: pointer;
  
  &:hover {
    background: #2a2a2a;
  }
`;

const DayEvent = styled(motion.div)<{ color: string; duration: number }>`
  position: absolute;
  left: 4px;
  right: 4px;
  background: ${props => props.color}40;
  border: 1px solid ${props => props.color};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  color: ${props => props.color};
  z-index: 1;
  height: ${props => Math.max(20, props.duration * 60 - 4)}px;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.color}60;
  }
`;

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: '朝シフト',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 8)),
    type: 'shift',
    color: '#9333ea'
  },
  {
    id: '2',
    title: 'チームミーティング',
    start: new Date(new Date().setHours(10, 30)),
    end: new Date(new Date().setHours(11, 30)),
    type: 'meeting',
    color: '#0ea5e9'
  },
  {
    id: '3',
    title: 'ランチタイム',
    start: new Date(new Date().setHours(12, 0)),
    end: new Date(new Date().setHours(13, 0)),
    type: 'break',
    color: '#16a34a'
  },
  {
    id: '4',
    title: 'プロジェクト会議',
    start: new Date(new Date().setHours(14, 0)),
    end: new Date(new Date().setHours(15, 30)),
    type: 'meeting',
    color: '#f59e0b'
  },
  {
    id: '5',
    title: '夜勤シフト',
    start: new Date(new Date().setHours(22, 0)),
    end: new Date(new Date().setHours(23, 59)),
    type: 'shift',
    color: '#dc2626'
  },
];

const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  view,
  events = mockEvents,
  onDateClick,
  onEventClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const previousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const previousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };

  const nextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };

  const getEventsForDayAndHour = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const eventStartHour = eventStart.getHours();
      const eventEndHour = eventEnd.getHours();
      
      return isSameDay(eventStart, date) && 
             hour >= eventStartHour && 
             hour < eventEndHour;
    });
  };

  const renderMonthView = () => (
    <CalendarGrid>
      {['月', '火', '水', '木', '金', '土', '日'].map(day => (
        <WeekDayHeader key={day}>{day}</WeekDayHeader>
      ))}
      
      <AnimatePresence mode="wait">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          
          return (
            <DayCell
              key={day.toISOString()}
              isCurrentMonth={isCurrentMonth}
              isToday={isTodayDate}
              hasEvents={dayEvents.length > 0}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => onDateClick?.(day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DayNumber isToday={isTodayDate}>
                {format(day, 'd')}
              </DayNumber>
              
              <EventsContainer>
                {dayEvents.slice(0, 3).map(event => (
                  <EventPreview
                    key={event.id}
                    color={event.color}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    whileHover={{ scale: 1.05 }}
                    title={event.title}
                  >
                    {event.title}
                  </EventPreview>
                ))}
                {dayEvents.length > 3 && (
                  <EventDot color="var(--accent-color)" />
                )}
              </EventsContainer>
            </DayCell>
          );
        })}
      </AnimatePresence>
    </CalendarGrid>
  );

  const renderWeekView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <WeekView>
        <TimeSlot></TimeSlot>
        {['月', '火', '水', '木', '金', '土', '日'].map(day => (
          <WeekDayHeader key={day}>{day}</WeekDayHeader>
        ))}
        
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <TimeSlot>{hour.toString().padStart(2, '0')}:00</TimeSlot>
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <HourSlot key={`${hour}-${dayIndex}`}>
                {/* ここに時間別のイベントを表示 */}
              </HourSlot>
            ))}
          </React.Fragment>
        ))}
      </WeekView>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDay(currentDate);
    
    return (
      <DayView>
        <DayHeader>
          <DayTitle>{format(currentDate, 'EEEE', { locale: ja })}</DayTitle>
          <DayDate>{format(currentDate, 'yyyy年M月d日', { locale: ja })}</DayDate>
        </DayHeader>
        
        <TimelineContainer>
          <TimeSidebar>
            {hours.map(hour => (
              <TimelineSlot key={hour}>
                {hour.toString().padStart(2, '0')}:00
              </TimelineSlot>
            ))}
          </TimeSidebar>
          
          <DayContent>
            {hours.map(hour => {
              const hourEvents = getEventsForDayAndHour(currentDate, hour);
              
              return (
                <DayEventSlot key={hour}>
                  {hourEvents.map(event => {
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    const startMinute = eventStart.getMinutes();
                    const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60); // 時間単位
                    const topOffset = (startMinute / 60) * 60; // 分に基づくオフセット
                    
                    return (
                      <DayEvent
                        key={event.id}
                        color={event.color}
                        duration={duration}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ 
                          top: `${topOffset}px`,
                          height: `${Math.max(20, duration * 60 - 2)}px`
                        }}
                        onClick={() => onEventClick?.(event)}
                        whileHover={{ scale: 1.02 }}
                        title={`${event.title} (${format(eventStart, 'HH:mm')} - ${format(eventEnd, 'HH:mm')})`}
                      >
                        <div style={{ fontWeight: 600 }}>{event.title}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                          {format(eventStart, 'HH:mm')} - {format(eventEnd, 'HH:mm')}
                        </div>
                      </DayEvent>
                    );
                  })}
                </DayEventSlot>
              );
            })}
          </DayContent>
        </TimelineContainer>
      </DayView>
    );
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavigationButton
          onClick={view === 'day' ? previousDay : previousMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </NavigationButton>
        
        <MonthTitle>
          {view === 'day' 
            ? format(currentDate, 'yyyy年M月d日 (EEEE)', { locale: ja })
            : format(currentDate, 'yyyy年 MMMM', { locale: ja })
          }
        </MonthTitle>
        
        <NavigationButton
          onClick={view === 'day' ? nextDay : nextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          →
        </NavigationButton>
      </CalendarHeader>

      {view === 'month' ? renderMonthView() : 
       view === 'week' ? renderWeekView() : 
       renderDayView()}
    </CalendarContainer>
  );
};

export default InteractiveCalendar;