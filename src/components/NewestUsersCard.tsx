import React from 'react';
import { Users, ArrowRight, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';

interface NewestUsersCardProps {
  users: UserAccount[];
  onViewAllUsers: () => void;
  onUserClick?: (user: UserAccount) => void;
}

export const NewestUsersCard: React.FC<NewestUsersCardProps> = ({
  users,
  onViewAllUsers,
  onUserClick,
}) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'Admin':
        return 'bg-sky-50 text-sky-800 border-sky-200/80';
      case 'Operator':
        return 'bg-purple-50 text-purple-800 border-purple-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getAvatarBadge = (initials: string) => {
    if (initials === 'SA') {
      return 'bg-emerald-100 text-emerald-900 border-emerald-200';
    }
    return 'bg-amber-100 text-amber-900 border-amber-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-center text-teal-600">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Newest users</h3>
            <p className="text-[11px] text-slate-500">System credentials & active accounts</p>
          </div>
        </div>

        <button
          id="btn-all-users"
          onClick={onViewAllUsers}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-teal-600 transition-colors"
        >
          <span>All users</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Users list */}
      <div className="divide-y divide-slate-100">
        {users.map((user) => (
          <div
            key={user.id}
            id={`user-item-${user.id}`}
            onClick={() => onUserClick?.(user)}
            className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar with initials */}
              <div
                className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center border shrink-0 font-mono-plate shadow-xs ${getAvatarBadge(
                  user.initials
                )}`}
              >
                {user.initials}
              </div>

              <div className="min-w-0 space-y-0.5">
                <div className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {user.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <span>{user.email}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Joined {user.joinedAgo}
                </div>
              </div>
            </div>

            {/* Role pill badge */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${getRoleBadge(
                user.role
              )}`}
            >
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
