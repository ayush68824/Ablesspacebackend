import { Request } from 'express'

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent'
}

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Review = 'Review',
  Completed = 'Completed'
}

export interface UserPayload {
  id: string
  email: string
  name: string
}

export type AuthRequest = Request & {
  user?: UserPayload
}



