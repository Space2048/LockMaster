export enum LockCategory {
  PESSIMISTIC = 'PESSIMISTIC',
  OPTIMISTIC = 'OPTIMISTIC',
  ADVANCED = 'ADVANCED'
}

export interface LockDefinition {
  id: string;
  name: string;
  category: LockCategory;
  shortDesc: string;
  fullDesc: string;
  pros: string[];
  cons: string[];
  simulationType: 'MUTEX' | 'READ_WRITE' | 'SPIN';
}

export interface ThreadState {
  id: number;
  status: 'IDLE' | 'WAITING' | 'ACQUIRED' | 'READING' | 'WRITING';
  name: string;
  waitCount: number; // For simulation purposes (e.g. spin count)
}

export interface CodeRequest {
  lockName: string;
  language: string;
}
