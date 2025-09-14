import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { type RootState } from "redux/store";

export type SummaryStats = {
  dailyStats: Record<
    string,
    Record<string, { YES: number; UPDATED: number; NO: number }>
  >;
  documentTypeList: string[];
};

export type MonthlyTotal = {
  month: string;
  total: number;
};

type BlankCalendarProps = {
  selectedPeriod: "thisMonth" | "lastMonth" | "last3Months" | "thisYear";
};

export default function BlankCalendar({ selectedPeriod }: BlankCalendarProps) {
  const user = useSelector((state: RootState) => state.user);

  function getYearMonth(option?: string) {
    const now = new Date();
    let date = now;

    switch (option) {
      case "thisMonth":
        date = now;
        break;
      case "lastMonth":
        date = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case "last3Months":
        date = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case "thisYear":
        date = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        date = now;
    }

    return { year: date.getFullYear(), month: date.getMonth() + 1 };
  }

  const { year, month } = getYearMonth(selectedPeriod);
  const isYearly = selectedPeriod === "thisYear";
  const monthName = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });

  const { data: dailyData } = useQuery<SummaryStats>({
    queryKey: ["dailyStats", user.id, selectedPeriod],
    queryFn: async () => {
      const monthParam =
        selectedPeriod === "thisYear"
          ? `${year}`
          : `${year}-${month.toString().padStart(2, "0")}`;
      const res = await fetch(
        `http://localhost:3001/v1/encoded/recentmonthlyeverydaystats?id=${user.id}&month=${monthParam}`
      );
      if (!res.ok) throw new Error("Error fetching daily stats");
      return res.json();
    },
    enabled: !!user.id && !isYearly,
  });

  const { data: monthlyData, isLoading } = useQuery<MonthlyTotal[]>({
    queryKey: ["monthlyTotals", user.id, selectedPeriod],
    queryFn: async () => {
      const yearParam = year.toString();
      const res = await fetch(
        `http://localhost:3001/v1/encoded/getYearlyTotal?id=${user.id}&year=${yearParam}`
      );
      if (!res.ok) throw new Error("Error fetching monthly totals");
      return res.json();
    },
    enabled: !!user.id && isYearly,
  });

  if (isLoading) return <div>Loading...</div>;

  const statsData = dailyData?.dailyStats || {};
  const documentTypes = dailyData?.documentTypeList || [];
  const daysWithData = Object.keys(statsData).sort();

    function downloadCSV() {
    if (!dailyData) return;

    const rows: string[] = [];
    const headers = ["Date", "Document Type", "Encoded", "Updated", "Issue"];
    rows.push(headers.join(","));

    Object.entries(dailyData.dailyStats).forEach(([date, types]) => {
        const documentTypes = Object.keys(types).join(","); // join without extra spaces
        let totalYES = 0;
        let totalUPDATED = 0;
        let totalNO = 0;

        Object.values(types).forEach((counts) => {
        totalYES += counts.YES || 0;
        totalUPDATED += counts.UPDATED || 0;
        totalNO += counts.NO || 0;
        });

        const row = [date, documentTypes, totalYES, totalUPDATED, totalNO];
        rows.push(row.map((v) => `"${v}"`).join(",")); // wrap values in quotes to avoid CSV bugs
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute(
        "href",
        encodedUri
    );
    link.setAttribute("download", `daily_stats_${monthName}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }



  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 font-semibold text-black text-lg">
          <Calendar size={20} />
          {isYearly ? "Monthly Encoding Total" : "Daily Encoding Progress"}
        </div>

        {!isYearly && dailyData && (
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Download CSV
          </button>
        )}
      </div>

      {!isYearly && (
        <div className="mb-4 font-medium text-gray-700">
          Month: {monthName} {year}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-medium text-gray-700 sticky left-0 bg-white border-r border-gray-200">
                {isYearly ? "Month" : "Day"}
              </th>
              {!isYearly &&
                documentTypes.map((type) => (
                  <th
                    key={type}
                    className="text-center py-2 px-3 font-medium text-gray-700"
                  >
                    {type}
                  </th>
                ))}
              <th className="text-center py-2 px-3 font-medium text-gray-700 bg-blue-50">
                Encoded / Updated / Issue
              </th>
            </tr>
          </thead>

          <tbody>
            {isYearly
              ? monthlyData?.map((m) => (
                  <tr
                    key={m.month}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-2 sticky left-0 bg-white border-r border-gray-200">
                      {m.month}
                    </td>
                    <td className="text-center py-2 px-3 bg-blue-50 font-bold">
                      {m.total}
                    </td>
                  </tr>
                ))
              : daysWithData.map((dateStr) => {
                  const totalEncoded = documentTypes.reduce((sum, type) => {
                    const countObj = statsData[dateStr][type] || {
                      YES: 0,
                      UPDATED: 0,
                      NO: 0,
                    };
                    return sum + countObj.YES;
                  }, 0);

                  const totalUpdated = documentTypes.reduce((sum, type) => {
                    const countObj = statsData[dateStr][type] || {
                      YES: 0,
                      UPDATED: 0,
                      NO: 0,
                    };
                    return sum + countObj.UPDATED;
                  }, 0);

                  const totalIssue = documentTypes.reduce((sum, type) => {
                    const countObj = statsData[dateStr][type] || {
                      YES: 0,
                      UPDATED: 0,
                      NO: 0,
                    };
                    return sum + countObj.NO;
                  }, 0);

                  return (
                    <tr
                      key={dateStr}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2 px-2 sticky left-0 bg-white border-r border-gray-200">
                        {new Date(dateStr).getDate()}
                      </td>

                      {documentTypes.map((type) => {
                        const countObj =
                          statsData[dateStr][type] || { YES: 0, UPDATED: 0, NO: 0 };
                        return (
                          <td key={type} className="text-center py-2 px-3">
                            {countObj.YES} / {countObj.UPDATED} / {countObj.NO}
                          </td>
                        );
                      })}

                      <td className="text-center py-2 px-3 bg-blue-50 font-bold">
                        {totalEncoded} / {totalUpdated} / {totalIssue}
                      </td>
                    </tr>
                  );
                })}

            <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
              <td className="py-3 px-2 sticky left-0 bg-gray-100 border-r border-gray-200">
                TOTAL
              </td>
              {documentTypes.map((type) => {
                const typeEncoded = Object.values(statsData).reduce(
                  (sum, day) => sum + (day[type]?.YES || 0),
                  0
                );
                const typeUpdated = Object.values(statsData).reduce(
                  (sum, day) => sum + (day[type]?.UPDATED || 0),
                  0
                );
                const typeIssue = Object.values(statsData).reduce(
                  (sum, day) => sum + (day[type]?.NO || 0),
                  0
                );
                return (
                  <td
                    key={type}
                    className="text-center py-3 px-3 font-bold text-blue-600"
                  >
                    {typeEncoded} / {typeUpdated} / {typeIssue}
                  </td>
                );
              })}
              <td className="text-center py-3 px-3 bg-blue-100 font-bold text-blue-700">
                {Object.values(statsData).reduce(
                  (sum, day) =>
                    sum +
                    Object.values(day).reduce(
                      (daySum, countObj) =>
                        daySum + countObj.YES + countObj.UPDATED + countObj.NO,
                      0
                    ),
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
