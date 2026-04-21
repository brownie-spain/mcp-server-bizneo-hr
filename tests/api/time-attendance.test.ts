import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TimeAttendanceResource } from '../../src/api/resources/time-attendance.js';
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

describe('TimeAttendanceResource', () => {
  let client: BizneoClient;
  let timeAttendance: TimeAttendanceResource;

  beforeEach(() => {
    client = mockClient();
    timeAttendance = new TimeAttendanceResource(client);
  });

  it('lists global logged times', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [], meta: {} });

    await timeAttendance.listLoggedTimes({ start_date: '2024-01-01', end_date: '2024-01-31' });

    expect(client.get).toHaveBeenCalledWith('/api/v1/logged-times', {
      start_date: '2024-01-01',
      end_date: '2024-01-31',
    });
  });

  it('lists user logged times', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [], meta: {} });

    await timeAttendance.listUserLoggedTimes(1, { start_date: '2024-01-01' });

    expect(client.get).toHaveBeenCalledWith('/api/v1/users/1/logged-times', { start_date: '2024-01-01' });
  });

  it('creates user logged time', async () => {
    const payload = { start_time: '2024-01-15T09:00:00Z', end_time: '2024-01-15T17:00:00Z' };
    vi.mocked(client.post).mockResolvedValue({ data: { id: 1, ...payload } });

    await timeAttendance.createUserLoggedTime(1, payload);

    expect(client.post).toHaveBeenCalledWith('/api/v1/users/1/logged-times', payload);
  });

  it('deletes user logged time', async () => {
    vi.mocked(client.delete).mockResolvedValue(undefined);

    await timeAttendance.deleteUserLoggedTime(1, 99);

    expect(client.delete).toHaveBeenCalledWith('/api/v1/users/1/logged-times/99');
  });

  it('starts user chronometer', async () => {
    vi.mocked(client.post).mockResolvedValue({ data: { id: 1, status: 'running' } });

    await timeAttendance.startUserChronometer(1, { telework: true });

    expect(client.post).toHaveBeenCalledWith('/api/v1/users/1/chronometers/start', { telework: true });
  });

  it('stops user chronometer', async () => {
    vi.mocked(client.post).mockResolvedValue({ data: { id: 1, status: 'stopped' } });

    await timeAttendance.stopUserChronometer(1);

    expect(client.post).toHaveBeenCalledWith('/api/v1/users/1/chronometers/stop');
  });

  it('lists schedules', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [], meta: {} });

    await timeAttendance.listSchedules();

    expect(client.get).toHaveBeenCalledWith('/api/v1/schedules', undefined);
  });

  it('assigns schedule to user', async () => {
    vi.mocked(client.post).mockResolvedValue(undefined);

    await timeAttendance.assignSchedule(1, 5, '2024-01-01');

    expect(client.post).toHaveBeenCalledWith('/api/v1/schedules/assignments', {
      user_id: 1,
      schedule_id: 5,
      start_date: '2024-01-01',
    });
  });

  it('starts bulk chronometers', async () => {
    vi.mocked(client.post).mockResolvedValue(undefined);

    await timeAttendance.startChronometers([1, 2, 3]);

    expect(client.post).toHaveBeenCalledWith('/api/v1/chronometers/start', { user_ids: [1, 2, 3] });
  });
});
