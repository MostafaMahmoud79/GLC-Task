"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Employee = {
  id: number;
  name: string;
  email: string;
  phone: string;
  departmentId: number;
  position: string;
  salary: number;
  joinDate: string;
  status: "Active" | "Inactive" | "On Leave";
  isDeleted?: boolean;
};

type EmployeesState = {
  employees: Employee[];
  activeEmployees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: number, updated: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  getEmployeesByDepartment: (departmentId: number) => Employee[];
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    email: "ahmed@company.com",
    phone: "+20 100 123 4567",
    departmentId: 1,
    position: "Frontend Developer",
    salary: 15000,
    joinDate: "2023-01-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Sara Ali",
    email: "sara@company.com",
    phone: "+20 100 234 5678",
    departmentId: 2,
    position: "HR Manager",
    salary: 20000,
    joinDate: "2022-06-10",
    status: "Active",
  },
  {
    id: 3,
    name: "Mohamed Hassan",
    email: "mohamed@company.com",
    phone: "+20 100 345 6789",
    departmentId: 1,
    position: "Backend Developer",
    salary: 18000,
    joinDate: "2023-03-20",
    status: "Active",
  },
  {
    id: 4,
    name: "Fatma Ibrahim",
    email: "fatma@company.com",
    phone: "+20 100 456 7890",
    departmentId: 3,
    position: "Accountant",
    salary: 12000,
    joinDate: "2023-05-01",
    status: "On Leave",
  },
  {
    id: 5,
    name: "Omar Khaled",
    email: "omar@company.com",
    phone: "+20 100 567 8901",
    departmentId: 1,
    position: "UI/UX Designer",
    salary: 14000,
    joinDate: "2023-07-12",
    status: "Active",
  },
];

const updateActiveEmployees = (employees: Employee[]) => {
  return employees.filter((emp) => !emp.isDeleted);
};

export const useEmployeesStore = create(
  persist<EmployeesState>(
    (set, get) => ({
      employees: initialEmployees,
      activeEmployees: updateActiveEmployees(initialEmployees),

      setEmployees: (employees) =>
        set({ employees, activeEmployees: updateActiveEmployees(employees) }),

      addEmployee: (employee) => {
        const newId = Math.max(...get().employees.map((e) => e.id), 0) + 1;
        const newEmployees = [...get().employees, { ...employee, id: newId }];
        set({
          employees: newEmployees,
          activeEmployees: updateActiveEmployees(newEmployees),
        });
      },

      updateEmployee: (id, updated) => {
        const newEmployees = get().employees.map((emp) =>
          emp.id === id ? { ...emp, ...updated } : emp
        );
        set({
          employees: newEmployees,
          activeEmployees: updateActiveEmployees(newEmployees),
        });
      },

      deleteEmployee: (id) => {
        const newEmployees = get().employees.map((emp) =>
          emp.id === id ? { ...emp, isDeleted: true } : emp
        );
        set({
          employees: newEmployees,
          activeEmployees: updateActiveEmployees(newEmployees),
        });
      },

      getEmployeesByDepartment: (departmentId) => {
        return get().activeEmployees.filter(
          (emp) => emp.departmentId === departmentId
        );
      },
    }),
    {
      name: "employees-storage",
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