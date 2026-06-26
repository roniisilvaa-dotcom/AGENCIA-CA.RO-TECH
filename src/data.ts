import { Project, Meeting, ApprovalItem, Publication, PendingItem, ResultMetrics, Client } from "./types";

export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_MEETINGS: Meeting[] = [];

export const INITIAL_APPROVALS: ApprovalItem[] = [];

export const INITIAL_PUBLICATIONS: Publication[] = [];

export const INITIAL_PENDINGS: PendingItem[] = [];

export const INITIAL_METRICS: ResultMetrics = {
  reach: 0,
  impressions: 0,
  engagement: 0,
  clicks: 0,
  leads: 0,
  opportunities: 0
};

// These synchronous functions now just return initial defaults on first render,
// as the actual data will be loaded asynchronously in App.tsx via /api/sync
export function getSavedOrCreate<T>(key: string, initial: T): T {
  return initial;
}

export async function saveState<T>(key: string, data: T): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      await fetch('/api/saveState', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data })
      });
    } catch (err) {
      console.error('Failed to sync state to Neon DB', err);
    }
  }
}
