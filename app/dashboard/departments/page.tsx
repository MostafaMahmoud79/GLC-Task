"use client";

import { useState } from "react";
import { useDepartmentsStore } from "@/store/departments-store";
import { useEmployeesStore } from "@/store/employees-store";
import { useActivityStore } from "@/store/activity-store";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2, Users } from "lucide-react";

export default function DepartmentsPage() {
  const departments = useDepartmentsStore((s) => s.activeDepartments);
  const addDepartment = useDepartmentsStore((s) => s.addDepartment);
  const updateDepartment = useDepartmentsStore((s) => s.updateDepartment);
  const deleteDepartment = useDepartmentsStore((s) => s.deleteDepartment);
  const getEmployeesByDepartment = useEmployeesStore(
    (s) => s.getEmployeesByDepartment
  );
  const addActivity = useActivityStore((s) => s.addActivity);
  const user = useAuthStore((s) => s.user);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);

  const handleAddDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDepartment = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    addDepartment(newDepartment);
    addActivity({
      action: "Create",
      entity: "Department",
      entityName: newDepartment.name,
      userId: user?.email || "unknown",
      details: `Created new department`,
    });

    setIsAddDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleEditDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDepartment) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    updateDepartment(editingDepartment.id, updatedData);
    addActivity({
      action: "Update",
      entity: "Department",
      entityName: updatedData.name,
      userId: user?.email || "unknown",
      details: `Updated department information`,
    });

    setIsEditDialogOpen(false);
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = (dept: any) => {
    const employeesInDept = getEmployeesByDepartment(dept.id);
    if (employeesInDept.length > 0) {
      alert(
        `Cannot delete ${dept.name}. There are ${employeesInDept.length} employees in this department.`
      );
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${dept.name}?`)) {
      deleteDepartment(dept.id);
      addActivity({
        action: "Delete",
        entity: "Department",
        entityName: dept.name,
        userId: user?.email || "unknown",
        details: `Deleted department`,
      });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Departments Management
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <Label htmlFor="name">Department Name *</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Enter department description..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Department</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const employeesCount = getEmployeesByDepartment(dept.id).length;
          return (
            <Card key={dept.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{dept.name}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingDepartment(dept);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteDepartment(dept)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{dept.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {employeesCount} {employeesCount === 1 ? "employee" : "employees"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {departments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No departments found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Click "Add Department" to create your first department
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editingDepartment && (
            <form onSubmit={handleEditDepartment} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Department Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingDepartment.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  rows={4}
                  defaultValue={editingDepartment.description}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}