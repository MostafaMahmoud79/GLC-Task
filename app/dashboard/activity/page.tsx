"use client";

import { useState } from "react";
import { useActivityStore } from "@/store/activity-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Activity, Download } from "lucide-react";

export default function ActivityPage() {
  const activities = useActivityStore((s) => s.activities);
  const filterActivities = useActivityStore((s) => s.filterActivities);

  const [actionFilter, setActionFilter] = useState<string>("All");
  const [entityFilter, setEntityFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredActivities = filterActivities({
    action: actionFilter === "All" ? undefined : actionFilter,
    entity: entityFilter === "All" ? undefined : entityFilter,
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const headers = ["ID", "Action", "Entity", "Name", "User", "Timestamp", "Details"];
    const rows = filteredActivities.map((activity) => [
      activity.id,
      activity.action,
      activity.entity,
      activity.entityName,
      activity.userId,
      new Date(activity.timestamp).toLocaleString(),
      activity.details || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Activity Log</h1>
        <Button onClick={handleExportCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Actions</SelectItem>
                <SelectItem value="Create">Create</SelectItem>
                <SelectItem value="Update">Update</SelectItem>
                <SelectItem value="Delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Entities</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Department">Department</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No activities found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1.5 rounded-full ${
                              activity.action === "Create"
                                ? "bg-green-100"
                                : activity.action === "Update"
                                ? "bg-blue-100"
                                : "bg-red-100"
                            }`}
                          >
                            <Activity
                              className={`h-3 w-3 ${
                                activity.action === "Create"
                                  ? "text-green-600"
                                  : activity.action === "Update"
                                  ? "text-blue-600"
                                  : "text-red-600"
                              }`}
                            />
                          </div>
                          <span className="font-medium">{activity.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>{activity.entity}</TableCell>
                      <TableCell className="font-medium">
                        {activity.entityName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {activity.details || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {activity.userId}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of{" "}
          {filteredActivities.length} activities
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}