import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
`;

const Spinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid #2a2a2a;
  border-top: 3px solid var(--accent-color);
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: var(--secondary-color);
  font-size: 0.9rem;
  text-align: center;
`;

const LoadingSpinner = ({ message = "読み込み中..." }: { message?: string }) => {
  return (
    <LoadingContainer>
      <Spinner
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;