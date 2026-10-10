"use client";

import { useForm } from "@tanstack/react-form";
import { Edit2, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RoleBadge, StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { useGetAllUsers, useUpdateUserStatusOrRole } from "@/hooks";
import { formatDate } from "@/lib/utils";
import type { IUserProfile, UserRole, UserStatus } from "@/types";
import { updateUserStatusOrRoleSchema } from "@/validations";

interface EditUserFormProps {
  user: IUserProfile;
  onClose: () => void;
}

function EditUserForm({ user, onClose }: EditUserFormProps) {
  const updateMutation = useUpdateUserStatusOrRole();

  const form = useForm({
    defaultValues: {
      role: user.role,
      status: user.status,
    },
    validators: {
      onSubmit: updateUserStatusOrRoleSchema,
    },
    onSubmit: async ({ value }) => {
      updateMutation.mutate(
        {
          userId: user.id,
          payload: {
            role: value.role,
            status: value.status,
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 my-4"
    >
      <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1">
        <p className="text-sm font-semibold text-foreground">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>

      <FieldGroup>
        <form.Field name="role">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Assigned Role</FieldLabel>
                <Select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value as UserRole)
                  }
                  aria-invalid={isInvalid}
                >
                  <option value="ADMIN">Admin (Full System Privilege)</option>
                  <option value="RECRUITER">
                    Recruiter (Assessments & Billing)
                  </option>
                  <option value="CANDIDATE">
                    Candidate (Arena & Submissions)
                  </option>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="status">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Account Status</FieldLabel>
                <Select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value as UserStatus)
                  }
                  aria-invalid={isInvalid}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked (Prevent Sign In)</option>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <div className="pt-6 border-t border-border flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={updateMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="emerald"
          isLoading={updateMutation.isPending}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}

export function UserManagementTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [selectedUser, setSelectedUser] = useState<IUserProfile | null>(null);

  const { data: usersData, isLoading } = useGetAllUsers({
    page,
    limit,
    searchTerm: search || undefined,
    role: (roleFilter as UserRole) || undefined,
    status: (statusFilter as UserStatus) || undefined,
  });

  const users = usersData?.data || [];
  const meta = usersData?.meta || { total: 0, page: 1, limit: 10 };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="CANDIDATE">Candidate</option>
        </Select>

        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
        </Select>
      </div>

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                Loading users directory...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No users match the criteria.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                    className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Manage</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        page={page}
        total={meta.total}
        limit={limit}
        onPageChange={setPage}
      />

      {/* User Edit Drawer */}
      <Sheet
        open={Boolean(selectedUser)}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <SheetHeader>
          <SheetTitle>Manage User Account</SheetTitle>
          <SheetDescription>
            Change permission role or access status for {selectedUser?.name}.
          </SheetDescription>
        </SheetHeader>

        {selectedUser && (
          <EditUserForm
            key={selectedUser.id}
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </Sheet>
    </div>
  );
}

export default UserManagementTable;
