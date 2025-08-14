import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Project, TaskPriority, TaskCategory } from '../../types/task';

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
  z-index: 1000;
  padding: 20px;
`;

const FormContainer = styled(motion.div)`
  background: var(--primary-color);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #2a2a2a;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 24px;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #3a3a3a;
    color: var(--text-color);
  }
`;

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  padding: 12px 16px;
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

const TextArea = styled.textarea`
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }
  
  option {
    background: var(--primary-color);
    color: var(--text-color);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TagsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  min-height: 44px;
  align-items: center;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
  }
`;

const Tag = styled(motion.span)`
  background: var(--accent-color)40;
  color: var(--accent-color);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TagRemoveButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 0.8rem;
  
  &:hover {
    color: #ef4444;
  }
`;

const TagInput = styled.input`
  flex: 1;
  min-width: 100px;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 0.9rem;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  
  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: 1px solid ${props => props.variant === 'primary' ? 'var(--accent-color)' : '#3a3a3a'};
  border-radius: 8px;
  background: ${props => props.variant === 'primary' ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.variant === 'primary' ? 'white' : 'var(--text-color)'};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#8b5fe6' : '#2a2a2a'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ValidationError = styled.div`
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 4px;
`;

interface TaskCreateFormProps {
  projects: Project[];
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: '低', color: '#22c55e' },
  { value: 'medium', label: '中', color: '#f59e0b' },
  { value: 'high', label: '高', color: '#f97316' },
  { value: 'urgent', label: '緊急', color: '#ef4444' }
];

const categoryOptions: { value: TaskCategory; label: string }[] = [
  { value: 'development', label: '開発' },
  { value: 'design', label: 'デザイン' },
  { value: 'marketing', label: 'マーケティング' },
  { value: 'content', label: 'コンテンツ' },
  { value: 'research', label: 'リサーチ' },
  { value: 'meeting', label: 'ミーティング' },
  { value: 'other', label: 'その他' }
];

const TaskCreateForm: React.FC<TaskCreateFormProps> = ({
  projects,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium' as TaskPriority,
    category: 'development' as TaskCategory,
    dueDate: '',
    estimatedHours: '',
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }

    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'プロジェクトを選択してください';
    }

    if (formData.estimatedHours && (isNaN(Number(formData.estimatedHours)) || Number(formData.estimatedHours) <= 0)) {
      newErrors.estimatedHours = '正しい時間を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const selectedProject = projects.find(p => p.id === formData.projectId);

    const task: Partial<Task> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      projectId: formData.projectId,
      projectName: selectedProject?.name || '',
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
      tags: formData.tags,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false
    };

    onSubmit(task);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag.trim()]
        });
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <FormContainer
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <FormHeader>
          <FormTitle>
            ➕ 新しいタスクを作成
          </FormTitle>
          <CloseButton
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </CloseButton>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <FormBody>
            <FormSection>
              <SectionTitle>📝 基本情報</SectionTitle>
              
              <FormField>
                <Label htmlFor="title">タイトル *</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="タスクのタイトルを入力..."
                />
                {errors.title && <ValidationError>{errors.title}</ValidationError>}
              </FormField>

              <FormField>
                <Label htmlFor="description">説明 *</Label>
                <TextArea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="タスクの詳細な説明を入力..."
                />
                {errors.description && <ValidationError>{errors.description}</ValidationError>}
              </FormField>
            </FormSection>

            <FormSection>
              <SectionTitle>🏗️ プロジェクト設定</SectionTitle>
              
              <FormRow>
                <FormField>
                  <Label htmlFor="project">プロジェクト *</Label>
                  <Select
                    id="project"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  >
                    <option value="">プロジェクトを選択</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.icon} {project.name}
                      </option>
                    ))}
                  </Select>
                  {errors.projectId && <ValidationError>{errors.projectId}</ValidationError>}
                </FormField>

                <FormField>
                  <Label htmlFor="category">カテゴリ</Label>
                  <Select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </FormRow>

              <FormRow>
                <FormField>
                  <Label htmlFor="priority">優先度</Label>
                  <Select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField>
                  <Label htmlFor="estimatedHours">予想作業時間 (時間)</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                    placeholder="8"
                  />
                  {errors.estimatedHours && <ValidationError>{errors.estimatedHours}</ValidationError>}
                </FormField>
              </FormRow>

              <FormField>
                <Label htmlFor="dueDate">期限</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </FormField>
            </FormSection>

            <FormSection>
              <SectionTitle>🏷️ タグ</SectionTitle>
              
              <TagsContainer>
                <TagsInput>
                  {formData.tags.map(tag => (
                    <Tag
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {tag}
                      <TagRemoveButton
                        type="button"
                        onClick={() => removeTag(tag)}
                      >
                        ✕
                      </TagRemoveButton>
                    </Tag>
                  ))}
                  <TagInput
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Enterでタグを追加"
                  />
                </TagsInput>
              </TagsContainer>
            </FormSection>
          </FormBody>

          <FormActions>
            <Button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              タスクを作成
            </Button>
          </FormActions>
        </form>
      </FormContainer>
    </Overlay>
  );
};

export default TaskCreateForm;