import { MessageSquare, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function ActivityLog({
  activities,
  loading,
  companyId,
}: {
  activities: any[];
  loading: boolean;
  companyId: string;
}) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateMessage = (message: string, maxLength = 80) => {
    if (!message || message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 bg-zinc-800 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-5 w-32 bg-zinc-800 rounded mb-2"></div>
              <div className="h-4 w-full bg-zinc-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>No recent activity to display</p>
      </div>
    );
  }

  return (
       <div className="space-y-4">
            {activities.map((activity: any) => (
                <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'sent' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'
                        }`}>
                        {activity.type === 'sent' ? (
                            <ArrowUpRight className="w-4 h-4" />
                        ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${activity.type === 'sent' ? 'text-blue-400' : 'text-green-400'
                                }`}>
                                {activity.type === 'sent' ? 'Message Sent' : 'Message Received'}
                            </span>
                            <span className="text-xs text-zinc-500">
                                {formatTime(activity.timestamp)}
                            </span>
                        </div>
                        <p className="text-sm text-zinc-300 mt-1">
                            Message Send To: {activity?.userId && activity?.userId}
                        </p>
                    </div>
                </div>
            ))}
        </div>
  );
}
