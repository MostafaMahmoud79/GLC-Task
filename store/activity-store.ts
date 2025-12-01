"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ActivityLog = {
  id: number;
  action: "Create" | "Update" | "Delete";
  entity: "Employee" | "Department";
  entityName: string;
  userId: string;
  timestamp: string;
  details?: string;
};

type ActivityState = {
  activities: ActivityLog[];
  addActivity: (activity: Omit<ActivityLog, "id" | "timestamp">) => void;
  getRecentActivities: (limit?: number) => ActivityLog[];
  filterActivities: (filters: {
    action?: string;
    entity?: string;
  }) => ActivityLog[];
};

const initialActivities: ActivityLog[] = [
  {
    id: 1,
    action: "Create",
    entity: "Employee",
    entityName: "Ahmed Mohamed",
    userId: "admin@example.com",
    timestamp: "2024-11-30T10:00:00.000Z",
    details: "Added new employee to IT Department",
  },
  {
    id: 2,
    action: "Update",
    entity: "Department",
    entityName: "HR Department",
    userId: "admin@example.com",
    timestamp: "2024-11-30T09:00:00.000Z",
    details: "Updated department description",
  },
  {
    id: 3,
    action: "Delete",
    entity: "Employee",
    entityName: "Old Employee",
    userId: "manager@example.com",
    timestamp: "2024-11-30T08:00:00.000Z",
    details: "Removed employee from system",
  },
];

export const useActivityStore = create(
  persist<ActivityState>(
    (set, get) => ({
      activities: initialActivities,

      addActivity: (activity) => {
        const newId = Math.max(...get().activities.map((a) => a.id), 0) + 1;
        const newActivity = {
          ...activity,
          id: newId,
          timestamp: new Date().toISOString(),
        };
        set({
          activities: [newActivity, ...get().activities],
        });
      },

      getRecentActivities: (limit = 10) => {
        return get()
          .activities.slice(0, limit)
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
      },

      filterActivities: (filters) => {
        return get().activities.filter((activity) => {
          if (filters.action && activity.action !== filters.action) {
            return false;
          }
          if (filters.entity && activity.entity !== filters.entity) {
            return false;
          }
          return true;
        });
      },
    }),
    {
      name: "activity-storage",
      storage: createJSONStorage(() => {
        // Only use localStorage in browser
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        // Return dummy storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);