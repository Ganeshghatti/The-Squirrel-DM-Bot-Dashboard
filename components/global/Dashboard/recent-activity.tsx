import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      action: "purchased Premium Plan",
      time: "2 minutes ago",
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
      time: "15 minutes ago",
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
      time: "1 hour ago",
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
      time: "3 hours ago",
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
      time: "5 hours ago",
      amount: null,
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-4 rounded-lg bg-blue-950/40 p-3 transition-colors hover:bg-blue-900/30"
        >
          <Avatar className="h-10 w-10 border-2 border-blue-800/30">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback className="bg-blue-800/50 text-blue-100">{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none text-blue-100">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}
            </p>
            <p className="text-xs text-blue-300">{activity.time}</p>
          </div>
          {activity.amount && (
            <div className="rounded-full bg-blue-800/30 px-2.5 py-0.5 text-xs font-semibold text-blue-100">
              {activity.amount}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
