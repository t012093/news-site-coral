import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const InputContainer = styled.div`
  background: var(--primary-color);
  border-top: 1px solid #2a2a2a;
  padding: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  background: var(--background-color);
  border: 1px solid #2a2a2a;
  border-radius: 24px;
  padding: 0.5rem 1rem;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: var(--accent-color);
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.4;
  resize: none;
  min-height: 20px;
  max-height: 120px;
  padding: 0.5rem 0;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--accent-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendButton = styled(motion.button)<{ hasContent: boolean }>`
  background: ${props => props.hasContent 
    ? 'linear-gradient(135deg, var(--accent-color), #8b5fe6)' 
    : 'transparent'
  };
  border: 1px solid ${props => props.hasContent ? 'transparent' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
  transform: ${props => props.hasContent ? 'scale(1)' : 'scale(0.9)'};

  &:hover {
    transform: ${props => props.hasContent ? 'scale(1.05)' : 'scale(0.95)'};
    background: ${props => props.hasContent 
      ? 'linear-gradient(135deg, #8b5fe6, var(--accent-color))' 
      : 'rgba(255, 255, 255, 0.1)'
    };
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: scale(0.9);
  }
`;

const TypingIndicator = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  padding: 0.25rem 1rem 0 1rem;
  font-style: italic;
`;

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "メッセージを入力..."
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    autoResize();
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false);
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleSend = () => {
    const content = message.trim();
    if (content && !disabled) {
      onSendMessage(content);
      setMessage('');
      setIsTyping(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputContainer>
      <InputWrapper>
        <ActionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={disabled}
          title="絵文字"
        >
          😊
        </ActionButton>

        <ActionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={disabled}
          title="ファイル添付"
        >
          📎
        </ActionButton>

        <TextArea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
        />

        <SendButton
          hasContent={!!message.trim()}
          whileHover={{ scale: message.trim() ? 1.05 : 0.95 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          title="送信"
        >
          ➤
        </SendButton>
      </InputWrapper>

      {isTyping && (
        <TypingIndicator>
          入力中...
        </TypingIndicator>
      )}
    </InputContainer>
  );
};

export default MessageInput;