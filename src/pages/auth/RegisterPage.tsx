import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../types/auth';

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const RegisterCard = styled(motion.div)`
  background: var(--primary-color);
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  width: 100%;
  max-width: 450px;
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

const RegisterButton = styled(motion.button)`
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

const FooterText = styled.p`
  color: var(--secondary-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const LoginLink = styled(Link)`
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const PasswordHint = styled.div`
  background: rgba(156, 124, 244, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid rgba(156, 124, 244, 0.3);
`;

const HintTitle = styled.h4`
  color: var(--accent-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const HintList = styled.ul`
  color: var(--text-color);
  font-size: 0.8rem;
  margin: 0;
  padding-left: 1.2rem;
`;

const schema = yup.object().shape({
  email: yup
    .string()
    .email('有効なメールアドレスを入力してください')
    .required('メールアドレスは必須です'),
  username: yup
    .string()
    .min(3, 'ユーザー名は3文字以上で入力してください')
    .max(20, 'ユーザー名は20文字以下で入力してください')
    .matches(/^[a-zA-Z0-9_]+$/, 'ユーザー名は英数字とアンダースコアのみ使用できます')
    .required('ユーザー名は必須です'),
  displayName: yup
    .string()
    .min(2, '表示名は2文字以上で入力してください')
    .max(50, '表示名は50文字以下で入力してください')
    .required('表示名は必須です'),
  password: yup
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(128, 'パスワードは128文字以下で入力してください')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]+$/,
      'パスワードは大小英字・数字・特殊文字（!@#$%^&*(),.?":{}|<>）を含む必要があります'
    )
    .required('パスワードは必須です'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'パスワードが一致しません')
    .required('パスワードの確認は必須です'),
});

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      username: '',
      displayName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await registerUser(data);
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // エラーメッセージの解析
      let errorMessage = '登録に失敗しました。もう一度お試しください。';
      
      if (error.message) {
        if (error.message.includes('Password validation failed')) {
          errorMessage = 'パスワードが要件を満たしていません。パスワードの要件を確認してください。';
        } else if (error.message.includes('Email already exists')) {
          errorMessage = 'このメールアドレスは既に使用されています。';
        } else if (error.message.includes('Username already exists')) {
          errorMessage = 'このユーザー名は既に使用されています。';
        } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {
          errorMessage = 'サーバーに接続できませんでした。しばらく時間をおいて再度お試しください。';
        } else {
          errorMessage = error.message;
        }
      }
      
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>新規登録</Title>
          <Subtitle>CORALコミュニティに参加しましょう</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#ef4444',
              fontSize: '0.9rem'
            }}>
              ⚠️ {serverError}
            </div>
          )}
          
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
            <Label>ユーザー名</Label>
            <Input
              type="text"
              placeholder="your_username"
              hasError={!!errors.username}
              {...register('username')}
            />
            {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>表示名</Label>
            <Input
              type="text"
              placeholder="あなたの名前"
              hasError={!!errors.displayName}
              {...register('displayName')}
            />
            {errors.displayName && <ErrorMessage>{errors.displayName.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>パスワード</Label>
            <Input
              type="password"
              placeholder="••••••••"
              hasError={!!errors.password}
              {...register('password')}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>パスワード確認</Label>
            <Input
              type="password"
              placeholder="••••••••"
              hasError={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
          </FormGroup>

          <PasswordHint>
            <HintTitle>パスワードの要件:</HintTitle>
            <HintList>
              <li>8文字以上、128文字以下</li>
              <li>大文字・小文字・数字・特殊文字をそれぞれ含む</li>
              <li>特殊文字: !@#$%^&*(),.?":{}|&lt;&gt;</li>
              <li>一般的なパスワードは使用不可</li>
            </HintList>
          </PasswordHint>

          <RegisterButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? '登録中...' : 'アカウント作成'}
          </RegisterButton>
        </Form>

        <Footer>
          <FooterText>すでにアカウントをお持ちの方</FooterText>
          <LoginLink to="/login">ログインはこちら</LoginLink>
        </Footer>
      </RegisterCard>
    </Container>
  );
};

export default RegisterPage;