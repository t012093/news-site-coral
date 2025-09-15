import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

const EmailInfo = styled.div`
  background: #f0f9ff;
  border: 1px solid #7dd3fc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #0c4a6e;
  text-align: center;
  font-size: 0.9rem;
`;

const CodeInputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const CodeInput = styled.input`
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  background: #2a2a2a;
  border: 2px solid #404040;
  border-radius: 8px;
  color: var(--text-color);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(156, 124, 244, 0.2);
  }
`;

const schema = yup.object().shape({
  email: yup
    .string()
    .email('有効なメールアドレスを入力してください')
    .required('メールアドレスは必須です'),
  verificationCode: yup
    .string()
    .matches(/^\d{6}$/, '認証コードは6桁の数字で入力してください')
    .required('認証コードは必須です'),
  newPassword: yup
    .string()
    .min(6, 'パスワードは6文字以上で入力してください')
    .required('新しいパスワードは必須です'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'パスワードが一致しません')
    .required('パスワードの確認は必須です'),
});

interface ResetPasswordData {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<ResetPasswordData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: searchParams.get('email') || '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const emailValue = watch('email');

  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setValue('email', email);
    }
  }, [searchParams, setValue]);

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Update form value
    setValue('verificationCode', newCode.join(''));

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const onSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          verificationCode: data.verificationCode,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'パスワードの再設定に失敗しました');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      setError('verificationCode', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'エラーが発生しました',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <Container>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header>
            <Title>パスワード再設定完了</Title>
            <Subtitle>新しいパスワードが設定されました</Subtitle>
          </Header>

          <SuccessMessage>
            <p style={{ margin: 0, marginBottom: '0.5rem' }}>
              パスワードの再設定が正常に完了しました。
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              新しいパスワードでログインしてください。
            </p>
          </SuccessMessage>

          <SubmitButton
            type="button"
            onClick={handleGoToLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ログインページに進む
          </SubmitButton>
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
          <Title>パスワード再設定</Title>
          <Subtitle>
            認証コードと新しいパスワードを入力してください
          </Subtitle>
        </Header>

        {emailValue && (
          <EmailInfo>
            <strong>{emailValue}</strong> に送信された認証コードを入力してください
          </EmailInfo>
        )}

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

          <FormGroup>
            <Label>認証コード（6桁）</Label>
            <CodeInputContainer>
              {verificationCode.map((digit, index) => (
                <CodeInput
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeInput(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                />
              ))}
            </CodeInputContainer>
            {errors.verificationCode && <ErrorMessage>{errors.verificationCode.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>新しいパスワード</Label>
            <Input
              type="password"
              placeholder="新しいパスワード（6文字以上）"
              hasError={!!errors.newPassword}
              {...register('newPassword')}
            />
            {errors.newPassword && <ErrorMessage>{errors.newPassword.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>パスワード確認</Label>
            <Input
              type="password"
              placeholder="新しいパスワード（再入力）"
              hasError={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? '再設定中...' : 'パスワードを再設定'}
          </SubmitButton>
        </Form>

        <Footer>
          <BackLink to="/forgot-password">認証コードを再送信</BackLink>
        </Footer>
      </Card>
    </Container>
  );
};

export default ResetPasswordPage;
