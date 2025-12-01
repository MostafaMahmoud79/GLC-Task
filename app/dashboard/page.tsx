"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeesStore } from "@/store/employees-store";
import { useDepartmentsStore } from "@/store/departments-store";
import { useActivityStore } from "@/store/activity-store";
import { Users, Building2, DollarSign, Activity } from "lucide-react";
import dynamic from "next/dynamic";

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  const employees = useEmployeesStore((s) => s.activeEmployees);
  const departments = useDepartmentsStore((s) => s.activeDepartments);
  const activities = useActivityStore((s) => s.activities);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

  const employeesPerDepartment = departments.map((dept) => ({
    name: dept.name,
    count: employees.filter((emp) => emp.departmentId === dept.id).length,
  }));

  const statusData = [
    { name: "Active", value: employees.filter((e) => e.status === "Active").length, fill: "#10b981" },
    { name: "On Leave", value: employees.filter((e) => e.status === "On Leave").length, fill: "#f59e0b" },
    { name: "Inactive", value: employees.filter((e) => e.status === "Inactive").length, fill: "#ef4444" },
  ];

  const recentActivities = activities
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  if (!mounted) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">HR Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Total Employees</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Total Departments</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{totalDepartments}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Total Salary</p>
                <p className="text-xl sm:text-2xl font-bold mt-2">${totalSalary.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Active Employees</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2 text-green-600">
                  {employees.filter((e) => e.status === "Active").length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Employees per Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeesPerDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Employees by Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityItem({ activity }: { activity: any }) {
  return (
    <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
      <div className={`p-2 rounded-full ${activity.action === "Create" ? "bg-green-100" : activity.action === "Update" ? "bg-blue-100" : "bg-red-100"}`}>
        <Activity className={`h-4 w-4 ${activity.action === "Create" ? "text-green-600" : activity.action === "Update" ? "text-blue-600" : "text-red-600"}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{activity.action} {activity.entity}: {activity.entityName}</p>
        <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
        <p className="text-xs text-muted-foreground mt-1">By {activity.userId}</p>
      </div>
    </div>
  );
}
