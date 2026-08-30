"use client";

import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/features/notifications";
import { Bell, Search, CheckCircle } from "lucide-react";
import { Input } from "@/shared/ui/shad-cn/input";
import { Button } from "@/shared/ui/shad-cn/button";
import toast from "react-hot-toast";

// Native relative-time formatter (avoids a date-fns dependency).
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationsView() {
  const { data, isLoading } = useNotifications({ limit: 100 });

  const markAsReadMutation = useMarkNotificationRead();

  const markAllAsReadMutation = useMarkAllNotificationsRead();

  const handleMarkAll = () =>
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
    });

  const notifications = data?.data || [];

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">All Notifications</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-9 bg-card border-border h-10"
            />
          </div>
          <Button 
            variant="outline"
            className="border-border text-foreground hover:bg-white/5"
            onClick={handleMarkAll}
            disabled={markAllAsReadMutation.isPending || notifications.every((n) => n.read)}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-primary" />
            Mark all as read
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-muted-foreground bg-card border border-border p-8 rounded-xl text-center">
          No notifications found.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() =>
                !notification.read && markAsReadMutation.mutate(notification.id)
              }
              className={`flex items-start p-4 rounded-xl border border-border/50 transition-colors ${
                notification.read
                  ? "bg-background"
                  : "bg-card cursor-pointer hover:border-primary/40"
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mr-4">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className={`text-sm font-medium ${notification.read ? "text-foreground" : "text-white"}`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {notification.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsView;
