import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AbsencesResource } from '../../src/api/resources/absences.js';
import type { BizneoClient } from '../../src/api/client.js';

function mockClient(): BizneoClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    getRateLimiterStats: vi.fn(),
  } as unknown as BizneoClient;
}

describe('AbsencesResource', () => {
  let client: BizneoClient;
  let absences: AbsencesResource;

  beforeEach(() => {
    client = mockClient();
    absences = new AbsencesResource(client);
  });

  it('lists absences with filters', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [], meta: {} });

    await absences.list({ user_id: 1, start_date: '2024-01-01' });

    expect(client.get).toHaveBeenCalledWith('/api/v1/absences', { user_id: 1, start_date: '2024-01-01' });
  });

  it('lists absence kinds', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [{ id: 1, name: 'Vacation' }] });

    const result = await absences.listKinds();

    expect(client.get).toHaveBeenCalledWith('/api/v1/absences/kinds');
    expect(result.data).toHaveLength(1);
  });

  it('deletes an absence', async () => {
    vi.mocked(client.delete).mockResolvedValue(undefined);

    await absences.delete(10);

    expect(client.delete).toHaveBeenCalledWith('/api/v1/absences/10');
  });

  it('lists work calendars', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [] });

    await absences.listWorkCalendars();

    expect(client.get).toHaveBeenCalledWith('/api/v1/absences/work-calendars');
  });

  it('assigns a work calendar to a user', async () => {
    vi.mocked(client.post).mockResolvedValue(undefined);

    await absences.assignWorkCalendar(5, 2);

    expect(client.post).toHaveBeenCalledWith('/api/v1/absences/work-calendar-assignments', {
      user_id: 5,
      work_calendar_id: 2,
    });
  });

  it('creates a user absence', async () => {
    const payload = { kind_id: 1, start_date: '2024-06-01', end_date: '2024-06-05' };
    vi.mocked(client.post).mockResolvedValue({ data: { id: 100, ...payload } });

    const result = await absences.createUserAbsence(3, payload);

    expect(client.post).toHaveBeenCalledWith('/api/v1/users/3/absences', payload);
    expect(result.data).toBeDefined();
  });

  it('gets user absence summary with year', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [] });

    await absences.getUserAbsenceSummary(3, 2024);

    expect(client.get).toHaveBeenCalledWith('/api/v1/users/3/absence-summary', { year: 2024 });
  });

  it('gets user absence summary without year', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [] });

    await absences.getUserAbsenceSummary(3);

    expect(client.get).toHaveBeenCalledWith('/api/v1/users/3/absence-summary', undefined);
  });

  it('creates absence adjustment', async () => {
    const payload = { kind_id: 1, days: 2, comment: 'Correction' };
    vi.mocked(client.post).mockResolvedValue({ data: { id: 50, ...payload } });

    await absences.createUserAbsenceAdjustment(3, payload);

    expect(client.post).toHaveBeenCalledWith('/api/v1/users/3/absence-adjustments', payload);
  });

  it('deletes absence adjustment', async () => {
    vi.mocked(client.delete).mockResolvedValue(undefined);

    await absences.deleteUserAbsenceAdjustment(3, 50);

    expect(client.delete).toHaveBeenCalledWith('/api/v1/users/3/absence-adjustments/50');
  });
});
