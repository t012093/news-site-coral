import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskFilter, TaskStatus, TaskPriority, TaskCategory } from '../../types/task';

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: between;
  cursor: pointer;
  padding: 4px 0;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const FilterToggle = styled(motion.span)<{ expanded: boolean }>`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  transform: rotate(${props => props.expanded ? '90deg' : '0deg'});
  transition: transform 0.3s ease;
`;

const FilterOptions = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const FilterChip = styled(motion.button)<{ selected: boolean }>`
  padding: 6px 12px;
  background: ${props => props.selected ? 'var(--accent-color)' : '#3a3a3a'};
  border: 1px solid ${props => props.selected ? 'var(--accent-color)' : '#4a4a4a'};
  border-radius: 16px;
  color: ${props => props.selected ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.selected ? 'var(--accent-color)' : '#4a4a4a'};
    border-color: var(--accent-color);
  }
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.8rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-color);
  padding: 4px 0;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--accent-color);
`;

const ClearFiltersButton = styled(motion.button)`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #4a4a4a;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--accent-color);
    color: var(--accent-color);
  }
`;

interface TaskFiltersProps {
  filter: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}

const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'todo', label: '未着手', color: '#64748b' },
  { value: 'in_progress', label: '進行中', color: '#0ea5e9' },
  { value: 'review', label: 'レビュー中', color: '#f59e0b' },
  { value: 'completed', label: '完了', color: '#22c55e' },
  { value: 'blocked', label: 'ブロック', color: '#ef4444' },
  { value: 'cancelled', label: 'キャンセル', color: '#6b7280' }
];

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: '低', color: '#22c55e' },
  { value: 'medium', label: '中', color: '#f59e0b' },
  { value: 'high', label: '高', color: '#f97316' },
  { value: 'urgent', label: '緊急', color: '#ef4444' }
];

const categoryOptions: { value: TaskCategory; label: string; color: string }[] = [
  { value: 'development', label: '開発', color: '#0ea5e9' },
  { value: 'design', label: 'デザイン', color: '#8b5cf6' },
  { value: 'marketing', label: 'マーケティング', color: '#f59e0b' },
  { value: 'content', label: 'コンテンツ', color: '#22c55e' },
  { value: 'research', label: 'リサーチ', color: '#6366f1' },
  { value: 'meeting', label: 'ミーティング', color: '#ec4899' },
  { value: 'other', label: 'その他', color: '#64748b' }
];

const TaskFilters: React.FC<TaskFiltersProps> = ({ filter, onChange }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['status', 'priority']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleArrayFilter = <T extends string>(key: keyof TaskFilter, value: T) => {
    const currentArray = (filter[key] as T[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    onChange({
      ...filter,
      [key]: newArray.length > 0 ? newArray : undefined
    });
  };

  const clearAllFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Object.keys(filter).some(key => {
    const value = filter[key as keyof TaskFilter];
    return value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0);
  });

  return (
    <FiltersContainer>
      <FilterSection>
        <FilterTitle onClick={() => toggleSection('status')}>
          📊 ステータス
          <FilterToggle expanded={expandedSections.has('status')}>
            ▶
          </FilterToggle>
        </FilterTitle>
        
        <AnimatePresence>
          {expandedSections.has('status') && (
            <FilterOptions
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FilterGroup>
                {statusOptions.map(option => (
                  <FilterChip
                    key={option.value}
                    selected={filter.status?.includes(option.value) || false}
                    onClick={() => toggleArrayFilter('status', option.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </FilterGroup>
            </FilterOptions>
          )}
        </AnimatePresence>
      </FilterSection>

      <FilterSection>
        <FilterTitle onClick={() => toggleSection('priority')}>
          🎯 優先度
          <FilterToggle expanded={expandedSections.has('priority')}>
            ▶
          </FilterToggle>
        </FilterTitle>
        
        <AnimatePresence>
          {expandedSections.has('priority') && (
            <FilterOptions
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FilterGroup>
                {priorityOptions.map(option => (
                  <FilterChip
                    key={option.value}
                    selected={filter.priority?.includes(option.value) || false}
                    onClick={() => toggleArrayFilter('priority', option.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </FilterGroup>
            </FilterOptions>
          )}
        </AnimatePresence>
      </FilterSection>

      <FilterSection>
        <FilterTitle onClick={() => toggleSection('category')}>
          🏷️ カテゴリ
          <FilterToggle expanded={expandedSections.has('category')}>
            ▶
          </FilterToggle>
        </FilterTitle>
        
        <AnimatePresence>
          {expandedSections.has('category') && (
            <FilterOptions
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FilterGroup>
                {categoryOptions.map(option => (
                  <FilterChip
                    key={option.value}
                    selected={filter.category?.includes(option.value) || false}
                    onClick={() => toggleArrayFilter('category', option.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </FilterGroup>
            </FilterOptions>
          )}
        </AnimatePresence>
      </FilterSection>

      <FilterSection>
        <FilterTitle onClick={() => toggleSection('dates')}>
          📅 期限
          <FilterToggle expanded={expandedSections.has('dates')}>
            ▶
          </FilterToggle>
        </FilterTitle>
        
        <AnimatePresence>
          {expandedSections.has('dates') && (
            <FilterOptions
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DateRangeContainer>
                <DateInput
                  type="date"
                  value={filter.dueDate?.from ? filter.dueDate.from.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    onChange({
                      ...filter,
                      dueDate: {
                        ...filter.dueDate,
                        from: date
                      }
                    });
                  }}
                  placeholder="開始日"
                />
                <DateInput
                  type="date"
                  value={filter.dueDate?.to ? filter.dueDate.to.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    onChange({
                      ...filter,
                      dueDate: {
                        ...filter.dueDate,
                        to: date
                      }
                    });
                  }}
                  placeholder="終了日"
                />
              </DateRangeContainer>

              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={filter.isOverdue || false}
                  onChange={(e) => onChange({
                    ...filter,
                    isOverdue: e.target.checked || undefined
                  })}
                />
                期限超過のみ
              </CheckboxContainer>
            </FilterOptions>
          )}
        </AnimatePresence>
      </FilterSection>

      {hasActiveFilters && (
        <ClearFiltersButton
          onClick={clearAllFilters}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🗑️ フィルターをクリア
        </ClearFiltersButton>
      )}
    </FiltersContainer>
  );
};

export default TaskFilters;