export interface ShiftRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  startTime: Date;
  endTime: Date;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  alternativeUsers?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShiftSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  requiredStaff: number;
  assignedUsers: AssignedUser[];
  skillRequirements?: string[];
  department: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AssignedUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  skills: string[];
  status: 'scheduled' | 'confirmed' | 'absent';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  skills: string[];
  workHours: {
    start: string;
    end: string;
  };
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  isOnline: boolean;
  lastActive: Date;
}

export interface ShiftStats {
  totalShifts: number;
  pendingRequests: number;
  approvedShifts: number;
  coverageRate: number;
  averageHours: number;
  overtimeHours: number;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  attendees: string[];
  organizer: string;
  type: 'team' | 'department' | 'company' | 'client';
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'shift' | 'meeting' | 'break' | 'vacation';
  color: string;
  details?: any;
}

export interface NotificationSettings {
  shiftReminders: boolean;
  scheduleChanges: boolean;
  teamUpdates: boolean;
  emergencyAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}