import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { ShiftRequest } from '../../types/shift';

interface ShiftRequestFormProps {
  onClose: () => void;
  onSubmit: (request: Omit<ShiftRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialDate?: Date;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const FormContainer = styled(motion.div)`
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
`;

const CloseButton = styled(motion.button)`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  
  &:hover {
    background: #2a2a2a;
  }
`;

const FormSteps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    height: 2px;
    background: #2a2a2a;
    z-index: 1;
  }
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const StepCircle = styled.div<{ active: boolean; completed: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => 
    props.completed ? 'var(--accent-color)' : 
    props.active ? 'var(--accent-color)' : '#2a2a2a'
  };
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
`;

const StepLabel = styled.span<{ active: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.active ? 'var(--accent-color)' : 'var(--text-color)'};
  text-align: center;
`;

const FormContent = styled.div`
  min-height: 300px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2);
  }
`;

const TimeInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' ? `
    background: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
    
    &:hover {
      background: #8b5fe6;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(147, 51, 234, 0.3);
    }
  ` : `
    background: transparent;
    border-color: #3a3a3a;
    color: var(--text-color);
    
    &:hover {
      background: #2a2a2a;
      border-color: var(--accent-color);
    }
  `}
`;

const RequestSummary = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const SummaryValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
`;

const ShiftRequestForm: React.FC<ShiftRequestFormProps> = ({
  onClose,
  onSubmit,
  initialDate
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    date: initialDate ? initialDate.toISOString().split('T')[0] : '',
    startTime: '09:00',
    endTime: '17:00',
    reason: '',
    alternativeUsers: [] as string[],
    userId: 'current-user-id',
    userName: 'ユーザー名',
    userAvatar: '/images/man.png',
    status: 'pending' as const
  });

  const steps = [
    { number: 1, label: '日時選択' },
    { number: 2, label: '詳細入力' },
    { number: 3, label: '確認' }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
    
    onSubmit({
      ...formData,
      startTime: startDateTime,
      endTime: endDateTime,
      date: new Date(formData.date)
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormGroup>
              <Label>希望日</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </FormGroup>
            
            <TimeInputGroup>
              <FormGroup>
                <Label>開始時刻</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>終了時刻</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </FormGroup>
            </TimeInputGroup>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormGroup>
              <Label>申請理由</Label>
              <TextArea
                placeholder="シフトの変更理由や詳細を入力してください..."
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>代替候補者（任意）</Label>
              <Select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !formData.alternativeUsers.includes(value)) {
                    setFormData(prev => ({
                      ...prev,
                      alternativeUsers: [...prev.alternativeUsers, value]
                    }));
                  }
                }}
              >
                <option value="">代替候補者を選択</option>
                <option value="user1">田中太郎</option>
                <option value="user2">山田花子</option>
                <option value="user3">佐藤次郎</option>
              </Select>
            </FormGroup>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <RequestSummary>
              <SummaryItem>
                <SummaryLabel>申請日:</SummaryLabel>
                <SummaryValue>{formData.date}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>時間:</SummaryLabel>
                <SummaryValue>{formData.startTime} - {formData.endTime}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>理由:</SummaryLabel>
                <SummaryValue>{formData.reason || '未入力'}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>代替候補者:</SummaryLabel>
                <SummaryValue>
                  {formData.alternativeUsers.length > 0 ? 
                    formData.alternativeUsers.join(', ') : '未選択'
                  }
                </SummaryValue>
              </SummaryItem>
            </RequestSummary>
            
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', textAlign: 'center' }}>
              上記の内容で申請を送信しますか？
            </p>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <FormContainer
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <FormHeader>
            <FormTitle>📝 シフト申請</FormTitle>
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </CloseButton>
          </FormHeader>

          <FormSteps>
            {steps.map((step) => (
              <Step
                key={step.number}
                active={currentStep === step.number}
                completed={currentStep > step.number}
              >
                <StepCircle
                  active={currentStep === step.number}
                  completed={currentStep > step.number}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </StepCircle>
                <StepLabel active={currentStep === step.number}>
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </FormSteps>

          <FormContent>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </FormContent>

          <FormActions>
            {currentStep > 1 && (
              <Button
                variant="secondary"
                onClick={handleBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                戻る
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!formData.date}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                次へ
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                申請送信
              </Button>
            )}
          </FormActions>
        </FormContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default ShiftRequestForm;