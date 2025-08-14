import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  updateTaskStatus, 
  deleteTask, 
  getProjects,
  bulkUpdateTasks,
  subscribeToTaskUpdates,
  CreateTaskRequest,
  UpdateTaskRequest
} from '../services/taskApi';
import { Task, TaskFilter, TaskSort, TaskStatus } from '../types/task';
import toast from 'react-hot-toast';

// タスク一覧取得
export const useTasks = (filter?: TaskFilter, sort?: TaskSort) => {
  return useQuery({
    queryKey: ['tasks', filter, sort],
    queryFn: () => getTasks(filter, sort),
    staleTime: 30000, // 30秒間はキャッシュを使用
    refetchOnWindowFocus: false,
  });
};

// プロジェクト一覧取得
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 300000, // 5分間はキャッシュを使用
  });
};

// タスク作成
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // タスク一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // 楽観的更新: 新しいタスクを既存のキャッシュに追加
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
        return oldTasks ? [newTask, ...oldTasks] : [newTask];
      });

      toast.success('タスクを作成しました');
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
      toast.error('タスクの作成に失敗しました');
    },
  });
};

// タスク更新
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskRequest }) =>
      updateTask(id, updates),
    onSuccess: (updatedTask) => {
      // タスク一覧のキャッシュを更新
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
        return oldTasks?.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ) || [];
      });

      toast.success('タスクを更新しました');
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
      toast.error('タスクの更新に失敗しました');
    },
  });
};

// タスクステータス変更（ドラッグ&ドロップ用）
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      // 楽観的更新
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
        return oldTasks?.map(task => 
          task.id === id 
            ? { ...task, status, updatedAt: new Date() }
            : task
        ) || [];
      });

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      // エラー時は楽観的更新をロールバック
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      
      console.error('Failed to update task status:', error);
      toast.error('タスクステータスの更新に失敗しました');
    },
    onSettled: () => {
      // 最終的にサーバーから最新データを取得
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// タスク削除
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, deletedId) => {
      // タスク一覧のキャッシュから削除
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
        return oldTasks?.filter(task => task.id !== deletedId) || [];
      });

      toast.success('タスクを削除しました');
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
      toast.error('タスクの削除に失敗しました');
    },
  });
};

// バルクタスク更新
export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskIds, updates }: { taskIds: string[]; updates: Partial<UpdateTaskRequest> }) =>
      bulkUpdateTasks(taskIds, updates),
    onSuccess: (updatedTasks) => {
      // タスク一覧のキャッシュを更新
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
        const updatedTasksMap = new Map(updatedTasks.map(task => [task.id, task]));
        
        return oldTasks?.map(task => 
          updatedTasksMap.has(task.id) ? updatedTasksMap.get(task.id)! : task
        ) || [];
      });

      toast.success(`${updatedTasks.length}件のタスクを更新しました`);
    },
    onError: (error) => {
      console.error('Failed to bulk update tasks:', error);
      toast.error('タスクの一括更新に失敗しました');
    },
  });
};

// リアルタイム更新用のカスタムフック
export const useTaskSubscription = () => {
  const queryClient = useQueryClient();

  const subscribeToUpdates = () => {
    // WebSocket接続でリアルタイム更新を受信
    const unsubscribe = subscribeToTaskUpdates(
      (updatedTask: Task) => {
        // リアルタイムでタスクを更新
        queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
          return oldTasks?.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          ) || [];
        });
      },
      (deletedTaskId: string) => {
        // リアルタイムでタスクを削除
        queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
          return oldTasks?.filter(task => task.id !== deletedTaskId) || [];
        });
      }
    );

    return unsubscribe;
  };

  return { subscribeToUpdates };
};