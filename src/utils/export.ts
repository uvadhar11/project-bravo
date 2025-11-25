import { toast } from "sonner";

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    toast.error("No data to export");
    return;
  }

  // 1. Extract headers
  const headers = Object.keys(data[0]);

  // 2. Convert rows to CSV string
  const csvContent = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((fieldName) => {
          const value = row[fieldName];
          // Handle strings with commas by wrapping in quotes
          return typeof value === "string" ? `"${value}"` : value;
        })
        .join(",")
    ),
  ].join("\n");

  // 3. Trigger Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export successful");
  }
}
