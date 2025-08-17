import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { LoginData } from '../../types/auth';

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled(motion.div)`
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  accent-color: var(--accent-color);
`;

const CheckboxLabel = styled.label`
  color: var(--secondary-color);
  font-size: 0.9rem;
  cursor: pointer;
`;

const LoginButton = styled(motion.button)`
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

const SignUpLink = styled(Link)`
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const AuthMethodToggle = styled.div`
  display: flex;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 2rem;
`;

const AuthMethodButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  background: ${props => props.isActive ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.isActive ? 'white' : 'var(--secondary-color)'};
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.isActive ? 'white' : 'var(--text-color)'};
  }
`;

const EmailVerificationCard = styled(motion.div)`
  text-align: center;
`;

const CodeInputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
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

const ResendButton = styled.button`
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;

  &:hover {
    color: #8b5fe6;
  }

  &:disabled {
    color: var(--secondary-color);
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    color: var(--text-color);
  }
`;

const schema = yup.object().shape({
  email: yup
    .string()
    .email('有効なメールアドレスを入力してください')
    .required('メールアドレスは必須です'),
  password: yup
    .string()
    .min(6, 'パスワードは6文字以上で入力してください')
    .required('パスワードは必須です'),
  rememberMe: yup.boolean().optional(),
});

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email('有効なメールアドレスを入力してください')
    .required('メールアドレスは必須です'),
});

type AuthMethod = 'password' | 'email';
type AuthStep = 'method' | 'email-input' | 'code-verification';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');
  const [authStep, setAuthStep] = useState<AuthStep>('method');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    } as LoginData,
  });

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<{ email: string }>({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      await login(data);
      navigate(from);
    } catch (error) {
      // エラーハンドリングはAuthContextで行われる
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          purpose: 'login',
        }),
      });

      if (!response.ok) {
        throw new Error('認証コードの送信に失敗しました');
      }

      setVerificationEmail(data.email);
      setAuthStep('code-verification');
      setResendCooldown(60);

      // カウントダウンタイマー
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Email verification error:', error);
      alert('認証コードの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

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

  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      alert('6桁の認証コードを入力してください');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: verificationEmail,
          code,
          purpose: 'login',
        }),
      });

      if (!response.ok) {
        throw new Error('認証に失敗しました');
      }

      const result = await response.json();
      
      if (result.success) {
        // Force reload to update auth state
        window.location.href = from;
      } else {
        alert('認証コードが正しくありません');
        setVerificationCode(['', '', '', '', '', '']);
      }
    } catch (error) {
      console.error('Code verification error:', error);
      alert('認証に失敗しました');
      setVerificationCode(['', '', '', '', '', '']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verificationEmail,
          purpose: 'login',
        }),
      });

      if (!response.ok) {
        throw new Error('認証コードの再送信に失敗しました');
      }

      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Resend error:', error);
      alert('認証コードの再送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodChange = (method: AuthMethod) => {
    setAuthMethod(method);
    setAuthStep(method === 'password' ? 'method' : 'email-input');
    setVerificationCode(['', '', '', '', '', '']);
    setVerificationEmail('');
  };

  // If user is already authenticated, redirect to profile
  if (isAuthenticated && user) {
    navigate('/profile');
    return null;
  }

  const renderPasswordLogin = () => (
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
        <Label>パスワード</Label>
        <Input
          type="password"
          placeholder="••••••••"
          hasError={!!errors.password}
          {...register('password')}
        />
        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
      </FormGroup>

      <CheckboxGroup>
        <Checkbox type="checkbox" id="rememberMe" {...register('rememberMe')} />
        <CheckboxLabel htmlFor="rememberMe">
          ログイン状態を保持する
        </CheckboxLabel>
      </CheckboxGroup>

      <LoginButton
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </LoginButton>
    </Form>
  );

  const renderEmailInput = () => (
    <Form onSubmit={handleEmailSubmit(onEmailSubmit)}>
      <FormGroup>
        <Label>メールアドレス</Label>
        <Input
          type="email"
          placeholder="your@email.com"
          hasError={!!emailErrors.email}
          {...registerEmail('email')}
        />
        {emailErrors.email && <ErrorMessage>{emailErrors.email.message}</ErrorMessage>}
      </FormGroup>

      <LoginButton
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? '送信中...' : '認証コードを送信'}
      </LoginButton>

      <BackButton type="button" onClick={() => handleMethodChange('password')}>
        パスワードでログイン
      </BackButton>
    </Form>
  );

  const renderCodeVerification = () => (
    <EmailVerificationCard
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>
        <strong>{verificationEmail}</strong> に認証コードを送信しました
      </p>
      
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

      <LoginButton
        type="button"
        disabled={isLoading || verificationCode.join('').length !== 6}
        onClick={handleVerifyCode}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? '認証中...' : '認証する'}
      </LoginButton>

      <div>
        <ResendButton
          type="button"
          disabled={resendCooldown > 0 || isLoading}
          onClick={handleResendCode}
        >
          {resendCooldown > 0 
            ? `再送信可能まで ${resendCooldown}秒` 
            : '認証コードを再送信'
          }
        </ResendButton>
      </div>

      <BackButton type="button" onClick={() => setAuthStep('email-input')}>
        メールアドレスを変更
      </BackButton>
    </EmailVerificationCard>
  );

  return (
    <Container>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>ログイン</Title>
          <Subtitle>CORALコミュニティへようこそ</Subtitle>
        </Header>

        {authStep === 'method' && (
          <>
            <AuthMethodToggle>
              <AuthMethodButton
                type="button"
                isActive={authMethod === 'password'}
                onClick={() => handleMethodChange('password')}
              >
                パスワード
              </AuthMethodButton>
              <AuthMethodButton
                type="button"
                isActive={authMethod === 'email'}
                onClick={() => handleMethodChange('email')}
              >
                Gmail認証
              </AuthMethodButton>
            </AuthMethodToggle>

            {authMethod === 'password' && renderPasswordLogin()}
          </>
        )}

        {authStep === 'email-input' && renderEmailInput()}
        {authStep === 'code-verification' && renderCodeVerification()}

        <Footer>
          <FooterText>アカウントをお持ちでない方</FooterText>
          <SignUpLink to="/register">新規登録はこちら</SignUpLink>
        </Footer>
      </LoginCard>
    </Container>
  );
};

export default LoginPage;