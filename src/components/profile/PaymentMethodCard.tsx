import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PaymentMethod } from '../../types/user';

const Card = styled(motion.div)`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #404040;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 4px 20px rgba(156, 124, 244, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardIcon = styled.span`
  font-size: 1.2rem;
`;

const CardNumber = styled.div`
  color: var(--secondary-color);
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
`;

const CardExpiry = styled.div`
  color: var(--secondary-color);
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const DefaultBadge = styled.span`
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--accent-color);
    color: white;
  }

  &.danger {
    color: #ff6b6b;
    border-color: #ff6b6b;

    &:hover {
      background: #ff6b6b;
      color: white;
    }
  }
`;

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const getCardIcon = (type: string, brand?: string) => {
    if (type === 'credit_card') {
      switch (brand?.toLowerCase()) {
        case 'visa':
          return '💳';
        case 'mastercard':
          return '💳';
        case 'jcb':
          return '💳';
        case 'amex':
          return '💳';
        default:
          return '💳';
      }
    } else if (type === 'bank_transfer') {
      return '🏦';
    } else if (type === 'paypal') {
      return '🅿️';
    }
    return '💳';
  };

  const getCardTypeLabel = (type: string) => {
    switch (type) {
      case 'credit_card':
        return 'クレジットカード';
      case 'bank_transfer':
        return '銀行振込';
      case 'paypal':
        return 'PayPal';
      default:
        return type;
    }
  };

  const formatCardNumber = (lastFour?: string) => {
    if (!lastFour) return '****';
    return `**** **** **** ${lastFour}`;
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <CardHeader>
        <CardInfo>
          <CardType>
            <CardIcon>{getCardIcon(paymentMethod.type, paymentMethod.brand)}</CardIcon>
            {getCardTypeLabel(paymentMethod.type)}
            {paymentMethod.brand && ` (${paymentMethod.brand.toUpperCase()})`}
          </CardType>
          
          {paymentMethod.type === 'credit_card' && (
            <>
              <CardNumber>{formatCardNumber(paymentMethod.lastFour)}</CardNumber>
              {paymentMethod.expiryDate && (
                <CardExpiry>有効期限: {paymentMethod.expiryDate}</CardExpiry>
              )}
            </>
          )}
        </CardInfo>
        
        {paymentMethod.isDefault && <DefaultBadge>デフォルト</DefaultBadge>}
      </CardHeader>

      <ActionButtons>
        {onEdit && (
          <ActionButton onClick={() => onEdit(paymentMethod.id)}>
            編集
          </ActionButton>
        )}
        
        {!paymentMethod.isDefault && onSetDefault && (
          <ActionButton onClick={() => onSetDefault(paymentMethod.id)}>
            デフォルトに設定
          </ActionButton>
        )}
        
        {onDelete && (
          <ActionButton 
            className="danger" 
            onClick={() => onDelete(paymentMethod.id)}
          >
            削除
          </ActionButton>
        )}
      </ActionButtons>
    </Card>
  );
};

export default PaymentMethodCard;