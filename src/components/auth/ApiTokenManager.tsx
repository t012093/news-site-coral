import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const Container = styled.div`
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  color: var(--text-color);
  font-size: 1.2rem;
  margin: 0;
`;

const CreateButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background: #8b5fe6;
  }
`;

const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TokenItem = styled.div`
  background: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: between;
  align-items: center;
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.div`
  color: var(--text-color);
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const TokenMeta = styled.div`
  color: var(--secondary-color);
  font-size: 0.8rem;
  display: flex;
  gap: 1rem;
`;

const RevokeButton = styled(motion.button)`
  padding: 0.5rem 0.75rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background: #ff5252;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: var(--primary-color);
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const Input = styled.input`
  padding: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  background: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.variant === 'primary' ? 'var(--accent-color)' : '#666'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  flex: 1;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#8b5fe6' : '#777'};
  }
`;

const TokenDisplay = styled.div`
  background: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`;

const TokenValue = styled.code`
  color: var(--accent-color);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8rem;
  word-break: break-all;
  display: block;
  margin-bottom: 0.5rem;
`;

const CopyButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background: #8b5fe6;
  }
`;

const Warning = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #ffc107;
  font-size: 0.9rem;
`;

interface ApiToken {
  id: string;
  name: string;
  description?: string;
  scope: string[];
  expiresAt?: string;
  lastUsedAt?: string;
  createdAt: string;
}

interface ApiTokenManagerProps {
  className?: string;
}

const ApiTokenManager: React.FC<ApiTokenManagerProps> = ({ className }) => {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expiresAt: '90days',
  });

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/api-tokens`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setTokens(data.data.tokens);
      }
    } catch (error) {
      console.error('Failed to load API tokens:', error);
    }
  };

  const createToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const expiresAt = formData.expiresAt === 'never' ? undefined :
        new Date(Date.now() + (parseInt(formData.expiresAt) * 24 * 60 * 60 * 1000));

      const response = await fetch(`${API_BASE_URL}/auth/api-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          expiresAt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewToken(data.data.token);
        setTokens(prev => [data.data.tokenInfo, ...prev]);
        setFormData({ name: '', description: '', expiresAt: '90days' });
      } else {
        throw new Error('Failed to create token');
      }
    } catch (error) {
      console.error('Failed to create API token:', error);
      alert('トークンの作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const revokeToken = async (tokenId: string) => {
    if (!confirm('このAPIトークンを無効化しますか？この操作は元に戻せません。')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/api-tokens/${tokenId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setTokens(prev => prev.filter(token => token.id !== tokenId));
      } else {
        throw new Error('Failed to revoke token');
      }
    } catch (error) {
      console.error('Failed to revoke API token:', error);
      alert('トークンの無効化に失敗しました');
    }
  };

  const copyToken = async () => {
    if (newToken) {
      await navigator.clipboard.writeText(newToken);
      alert('トークンをクリップボードにコピーしました');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewToken(null);
  };

  return (
    <Container className={className}>
      <Header>
        <Title>APIトークン</Title>
        <CreateButton
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          新規作成
        </CreateButton>
      </Header>

      <TokenList>
        {tokens.length === 0 ? (
          <div style={{ color: 'var(--secondary-color)', textAlign: 'center', padding: '2rem' }}>
            APIトークンがありません
          </div>
        ) : (
          tokens.map(token => (
            <TokenItem key={token.id}>
              <TokenInfo>
                <TokenName>{token.name}</TokenName>
                <TokenMeta>
                  <span>作成: {format(new Date(token.createdAt), 'yyyy/MM/dd', { locale: ja })}</span>
                  {token.lastUsedAt && (
                    <span>最終使用: {format(new Date(token.lastUsedAt), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
                  )}
                  {token.expiresAt && (
                    <span>期限: {format(new Date(token.expiresAt), 'yyyy/MM/dd', { locale: ja })}</span>
                  )}
                </TokenMeta>
              </TokenInfo>
              <RevokeButton
                onClick={() => revokeToken(token.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                無効化
              </RevokeButton>
            </TokenItem>
          ))
        )}
      </TokenList>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {newToken ? 'APIトークンが作成されました' : '新しいAPIトークンを作成'}
                </ModalTitle>
              </ModalHeader>

              {newToken ? (
                <>
                  <Warning>
                    ⚠️ このトークンは今回のみ表示されます。安全な場所に保存してください。
                  </Warning>
                  
                  <TokenDisplay>
                    <TokenValue>{newToken}</TokenValue>
                    <CopyButton
                      onClick={copyToken}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      コピー
                    </CopyButton>
                  </TokenDisplay>

                  <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    環境変数での使用例：
                    <TokenDisplay>
                      <TokenValue>export NEWS_SITE_API_TOKEN="{newToken}"</TokenValue>
                    </TokenDisplay>
                  </div>

                  <ModalActions>
                    <ActionButton variant="primary" onClick={closeModal}>
                      完了
                    </ActionButton>
                  </ModalActions>
                </>
              ) : (
                <Form onSubmit={createToken}>
                  <FormGroup>
                    <Label>名前 *</Label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Claude MCP Server"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>説明（任意）</Label>
                    <TextArea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="MCPサーバーでのタスク管理に使用"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>有効期限</Label>
                    <Select
                      value={formData.expiresAt}
                      onChange={e => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                    >
                      <option value="30">30日間</option>
                      <option value="90">90日間</option>
                      <option value="365">1年間</option>
                      <option value="never">無期限</option>
                    </Select>
                  </FormGroup>

                  <ModalActions>
                    <ActionButton
                      type="button"
                      variant="secondary"
                      onClick={closeModal}
                    >
                      キャンセル
                    </ActionButton>
                    <ActionButton
                      type="submit"
                      variant="primary"
                      disabled={isLoading || !formData.name.trim()}
                    >
                      {isLoading ? '作成中...' : '作成'}
                    </ActionButton>
                  </ModalActions>
                </Form>
              )}
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ApiTokenManager;