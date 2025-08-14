import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 12px 16px 12px 40px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
`;

const ClearButton = styled(motion.button)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #3a3a3a;
    color: var(--text-color);
  }
`;

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TaskSearch: React.FC<TaskSearchProps> = ({
  value,
  onChange,
  placeholder = 'タスクを検索...'
}) => {
  return (
    <SearchContainer>
      <SearchIcon>🔍</SearchIcon>
      <SearchInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      {value && (
        <ClearButton
          onClick={() => onChange('')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          ✕
        </ClearButton>
      )}
    </SearchContainer>
  );
};

export default TaskSearch;