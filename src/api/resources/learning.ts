import { BizneoClient } from '../client.js';
import type { Course, TrainingAction, Requisition, PaginatedResponse } from '../types.js';

export class LearningResource {
  constructor(private readonly client: BizneoClient) {}

  // Courses
  listCourses(params?: { page_number?: number; page_size?: number }): Promise<PaginatedResponse<Course>> {
    return this.client.get<PaginatedResponse<Course>>('/api/v1/courses', params as Record<string, unknown>);
  }

  getCourse(courseId: number): Promise<{ data: Course }> {
    return this.client.get<{ data: Course }>(`/api/v1/courses/${courseId}`);
  }

  createCourse(payload: { name: string; description?: string; duration_hours?: number; [key: string]: unknown }): Promise<{ data: Course }> {
    return this.client.post<{ data: Course }>('/api/v1/courses', payload);
  }

  updateCourse(courseId: number, payload: Partial<Course>): Promise<{ data: Course }> {
    return this.client.put<{ data: Course }>(`/api/v1/courses/${courseId}`, payload);
  }

  deleteCourse(courseId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/courses/${courseId}`);
  }

  // Training actions
  listTrainingActions(params?: {
    page_number?: number;
    page_size?: number;
    course_id?: number;
  }): Promise<PaginatedResponse<TrainingAction>> {
    return this.client.get<PaginatedResponse<TrainingAction>>('/api/v1/training-actions', params as Record<string, unknown>);
  }

  getTrainingAction(actionId: number): Promise<{ data: TrainingAction }> {
    return this.client.get<{ data: TrainingAction }>(`/api/v1/training-actions/${actionId}`);
  }

  createTrainingAction(payload: {
    name: string;
    course_id?: number;
    start_date?: string;
    end_date?: string;
    [key: string]: unknown;
  }): Promise<{ data: TrainingAction }> {
    return this.client.post<{ data: TrainingAction }>('/api/v1/training-actions', payload);
  }

  updateTrainingAction(actionId: number, payload: Partial<TrainingAction>): Promise<{ data: TrainingAction }> {
    return this.client.put<{ data: TrainingAction }>(`/api/v1/training-actions/${actionId}`, payload);
  }

  deleteTrainingAction(actionId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/training-actions/${actionId}`);
  }

  // Requisitions
  listRequisitions(params?: { page_number?: number; page_size?: number; user_id?: number }): Promise<PaginatedResponse<Requisition>> {
    return this.client.get<PaginatedResponse<Requisition>>('/api/v1/requisitions', params as Record<string, unknown>);
  }

  createRequisition(payload: { user_id: number; course_id?: number; [key: string]: unknown }): Promise<{ data: Requisition }> {
    return this.client.post<{ data: Requisition }>('/api/v1/requisitions', payload);
  }

  updateRequisition(requisitionId: number, payload: Partial<Requisition>): Promise<{ data: Requisition }> {
    return this.client.put<{ data: Requisition }>(`/api/v1/requisitions/${requisitionId}`, payload);
  }
}
