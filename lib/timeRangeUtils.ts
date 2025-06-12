// Utility functions for working with time ranges

export function getDateRangeFromTimeRange(timeRange: string): {
  startDate: Date | null;
  endDate: Date;
} {
  const endDate = new Date();
  let startDate: Date | null = null;

  switch (timeRange) {
    case "24h":
      startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "7d":
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case "all":
    default:
      startDate = null; // No start date filter for "all time"
      break;
  }

  return { startDate, endDate };
}

export function filterDataByTimeRange<T extends Record<string, any>>(
  data: T[],
  timeRange: string,
  dateField: string = "createdAt"
): T[] {
  if (timeRange === "all") {
    return data;
  }

  const { startDate } = getDateRangeFromTimeRange(timeRange);

  if (!startDate) {
    return data;
  }

  return data.filter((item) => {
    const itemDate = item[dateField];
    if (!itemDate) return false;

    // Handle different date formats
    let date: Date;
    if (itemDate instanceof Date) {
      date = itemDate;
    } else if (typeof itemDate === "string" || typeof itemDate === "number") {
      date = new Date(itemDate);
    } else {
      return false;
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return false;
    }

    return date >= startDate;
  });
}

export function getTimeRangeLabel(timeRange: string): string {
  const options = {
    "24h": "Last 24 Hours",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "Last Year",
    all: "All Time",
  };

  return options[timeRange as keyof typeof options] || "Unknown Range";
}
