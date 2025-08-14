import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Project } from '../../types/task';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectorLabel = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProjectSelect = styled(motion.select)`
  width: 100%;
  padding: 10px 12px;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  
  &:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2);
  }
  
  option {
    background: var(--primary-color);
    color: var(--text-color);
    padding: 8px;
  }
`;

const ProjectStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 6px;
  background: #2a2a2a;
  border-radius: 6px;
`;

const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-color);
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #3a3a3a;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled(motion.div)<{ progress: number; color: string }>`
  height: 100%;
  background: ${props => props.color};
  width: ${props => props.progress}%;
  transition: width 0.5s ease;
`;

interface ProjectSelectorProps {
  projects: Project[];
  selected: string;
  onChange: (projectId: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selected,
  onChange
}) => {
  const selectedProject = projects.find(p => p.id === selected);
  
  const getTotalStats = () => {
    return projects.reduce((total, project) => ({
      total: total.total + project.taskStats.total,
      completed: total.completed + project.taskStats.completed,
      inProgress: total.inProgress + project.taskStats.inProgress,
      overdue: total.overdue + project.taskStats.overdue
    }), { total: 0, completed: 0, inProgress: 0, overdue: 0 });
  };

  const totalStats = getTotalStats();
  const currentStats = selected === 'all' ? totalStats : selectedProject?.taskStats;

  return (
    <SelectorContainer>
      <SelectorLabel>
        🏗️ プロジェクト
      </SelectorLabel>
      
      <ProjectSelect
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <option value="all">すべてのプロジェクト</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.icon} {project.name}
          </option>
        ))}
      </ProjectSelect>

      {currentStats && (
        <>
          <ProjectStats>
            <StatItem>
              <StatValue>{currentStats.total || totalStats.total}</StatValue>
              <StatLabel>総タスク</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue style={{ color: '#22c55e' }}>
                {currentStats.completed || totalStats.completed}
              </StatValue>
              <StatLabel>完了</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue style={{ color: '#0ea5e9' }}>
                {currentStats.inProgress || totalStats.inProgress}
              </StatValue>
              <StatLabel>進行中</StatLabel>
            </StatItem>
          </ProjectStats>

          {selectedProject && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'between', 
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  プロジェクト進捗
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-color)', fontWeight: '600' }}>
                  {selectedProject.progress}%
                </span>
              </div>
              <ProgressBar>
                <ProgressFill
                  progress={selectedProject.progress}
                  color={selectedProject.color}
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedProject.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </ProgressBar>
            </div>
          )}

          {(currentStats.overdue || totalStats.overdue) > 0 && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              padding: '8px',
              marginTop: '8px'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '600' }}>
                ⚠️ 期限超過: {currentStats.overdue || totalStats.overdue}件
              </div>
            </div>
          )}
        </>
      )}
    </SelectorContainer>
  );
};

export default ProjectSelector;