"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Department = {
  id: number;
  name: string;
  description: string;
  managerId?: number;
  isDeleted?: boolean;
};

type DepartmentsState = {
  departments: Department[];
  activeDepartments: Department[];
  setDepartments: (departments: Department[]) => void;
  addDepartment: (department: Omit<Department, "id">) => void;
  updateDepartment: (id: number, updated: Partial<Department>) => void;
  deleteDepartment: (id: number) => void;
};

const initialDepartments: Department[] = [
  {
    id: 1,
    name: "IT Department",
    description: "Information Technology and Development",
    managerId: 1,
  },
  {
    id: 2,
    name: "HR Department",
    description: "Human Resources Management",
    managerId: 2,
  },
  {
    id: 3,
    name: "Finance Department",
    description: "Financial Operations and Accounting",
    managerId: 4,
  },
];

const updateActiveDepartments = (departments: Department[]) => {
  return departments.filter((dept) => !dept.isDeleted);
};

export const useDepartmentsStore = create(
  persist<DepartmentsState>(
    (set, get) => ({
      departments: initialDepartments,
      activeDepartments: updateActiveDepartments(initialDepartments),

      setDepartments: (departments) =>
        set({
          departments,
          activeDepartments: updateActiveDepartments(departments),
        }),

      addDepartment: (department) => {
        const newId = Math.max(...get().departments.map((d) => d.id), 0) + 1;
        const newDepartments = [
          ...get().departments,
          { ...department, id: newId },
        ];
        set({
          departments: newDepartments,
          activeDepartments: updateActiveDepartments(newDepartments),
        });
      },

      updateDepartment: (id, updated) => {
        const newDepartments = get().departments.map((dept) =>
          dept.id === id ? { ...dept, ...updated } : dept
        );
        set({
          departments: newDepartments,
          activeDepartments: updateActiveDepartments(newDepartments),
        });
      },

      deleteDepartment: (id) => {
        const newDepartments = get().departments.map((dept) =>
          dept.id === id ? { ...dept, isDeleted: true } : dept
        );
        set({
          departments: newDepartments,
          activeDepartments: updateActiveDepartments(newDepartments),
        });
      },
    }),
    {
      name: "departments-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);