import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://news-site-coral-production.up.railway.app/api';

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled(motion.div)`
  background: var(--primary-color);
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--secondary-color);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

  &::placeholder {
    color: var(--secondary-color);
  }
`;

const ErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 0.8rem;
`;

const SubmitButton = styled(motion.button)`
  padding: 0.75rem 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #8b5fe6;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #2a2a2a;
`;

const BackLink = styled(Link)`
  color: var(--secondary-color);
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    color: var(--accent-color);
    text-decoration: underline;
  }
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #065f46;
  text-align: center;
`;

const schema = yup.object().shape({
  email: yup
    .string()
    .email('有効なメールアドレスを入力してください')
    .required('メールアドレスは必須です'),
});

interface ForgotPasswordData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'リクエストの送信に失敗しました');
      }

      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('email', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'エラーが発生しました',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToReset = () => {
    navigate(`/reset-password?email=${encodeURIComponent(submittedEmail)}`);
  };

  if (isSubmitted) {
    return (
      <Container>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header>
            <Title>メール送信完了</Title>
            <Subtitle>認証コードをお送りしました</Subtitle>
          </Header>

          <SuccessMessage>
            <p style={{ margin: 0, marginBottom: '0.5rem' }}>
              <strong>{submittedEmail}</strong> に認証コードを送信しました。
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              メールをご確認の上、認証コードを入力してパスワードを再設定してください。
            </p>
          </SuccessMessage>

          <SubmitButton
            type="button"
            onClick={handleGoToReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            パスワード再設定に進む
          </SubmitButton>

          <Footer>
            <BackLink to="/login">ログインページに戻る</BackLink>
          </Footer>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>パスワードを忘れた方</Title>
          <Subtitle>
            登録されたメールアドレスを入力してください。
            パスワード再設定用の認証コードをお送りします。
          </Subtitle>
        </Header>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>メールアドレス</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              hasError={!!errors.email}
              {...register('email')}
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? '送信中...' : '認証コードを送信'}
          </SubmitButton>
        </Form>

        <Footer>
          <BackLink to="/login">ログインページに戻る</BackLink>
        </Footer>
      </Card>
    </Container>
  );
};

export default ForgotPasswordPage;
