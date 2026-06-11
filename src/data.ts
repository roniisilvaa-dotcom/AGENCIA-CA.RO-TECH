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

// Help helper for initial state setup in localStorage to manage data seamlessly and permit edits.
export function getSavedOrCreate<T>(key: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  const sav = localStorage.getItem(key);
  if (sav) {
    try {
      return JSON.parse(sav) as T;
    } catch (e) {
      return initial;
    }
  }
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

export function saveState<T>(key: string, data: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
