import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      action: "purchased Premium Plan",
      time: "2m ago",
      amount: "$59.99",
    },
    {
      id: 2,
      user: {
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SM",
      },
      action: "created a new account",
      time: "15m ago",
      amount: null,
    },
    {
      id: 3,
      user: {
        name: "David Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DC",
      },
      action: "submitted a support ticket",
      time: "1h ago",
      amount: null,
    },
    {
      id: 4,
      user: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EW",
      },
      action: "purchased Pro Package",
      time: "3h ago",
      amount: "$129.99",
    },
    {
      id: 5,
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
      action: "updated profile information",
      time: "5h ago",
      amount: null,
    },
  ]

  return (
    <div className="mt-5 space-y-3">
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-2.5 rounded-lg transition-all duration-300 hover:bg-blue-800/20 animate-slide-up"
          style={{ animationDelay: `${index * 100 + 100}ms` }}
        >
          <Avatar className="h-8 w-8 border border-blue-700/30 ring-2 ring-blue-500/10">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback className="bg-blue-800/50 text-blue-100 text-xs">{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-blue-100 leading-tight">
              <span className="font-medium text-white">{activity.user.name}</span>{" "}
              <span className="text-blue-200">{activity.action}</span>
            </p>
            <p className="text-xs text-blue-300/70 mt-0.5">{activity.time}</p>
          </div>
          {activity.amount && (
            <div className="rounded-full bg-blue-800/30 px-2.5 py-1 text-xs font-semibold text-blue-100 ring-1 ring-blue-700/20">
              {activity.amount}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
