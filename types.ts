
export enum FryerStatus {
  READY = 'READY',
  COOKING = 'COOKING',
  DONE = 'DONE'
}

export interface MenuItem {
  id: string;
  name: string;
  cookTime: number; // in seconds
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Fryer {
  id: number;
  status: FryerStatus;
  menuItem?: MenuItem | null;
  categoryName?: string | null;
  remainingTime: number;
  totalTime: number;
}

export interface LogEntry {
  id: string;
  date: string;
  time: string;
  fryerId: number;
  categoryName: string;
  itemName: string;
}
