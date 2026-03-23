import { Edit, Trash2, Shield, User, GraduationCap } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { cn } from '../../utils/helpers';

export function UserTable({ users, onChangeRole, onDelete, className }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role) => {
    const config = {
      ADMIN: { variant: 'danger', icon: Shield },
      INSTRUCTOR: { variant: 'primary', icon: GraduationCap },
      STUDENT: { variant: 'secondary', icon: User },
    };
    const { variant, icon: Icon } = config[role] || config.STUDENT;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {role}
      </Badge>
    );
  };

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-gray-200', className)}>
      <table className="w-full min-w-[800px] border-collapse bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-text">
              User
            </th>
            <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-text">
              Email
            </th>
            <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-text">
              Role
            </th>
            <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-text">
              Joined
            </th>
            <th className="border-b border-gray-200 px-6 py-4 text-right font-semibold text-text">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      fallback={user.name}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-text">{user.name}</p>
                      {user.bio && (
                        <p className="text-xs text-muted line-clamp-1">{user.bio}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted">{user.email}</td>
                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4 text-muted">{formatDate(user.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      value={user.role}
                      onChange={(e) => onChangeRole && onChangeRole(user, e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="INSTRUCTOR">Instructor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete && onDelete(user)}
                      className="text-red-500 hover:bg-red-50"
                      aria-label="Delete user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-muted">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
