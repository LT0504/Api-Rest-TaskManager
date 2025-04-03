export interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate: Date;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
  