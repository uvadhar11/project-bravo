import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export function exportToPDF(
  transactions: any[], 
  timeframe: string, 
  userFilter: string
) {
  const doc = new jsPDF();

  // 1. Header
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text("Expense Report", 14, 22);

  // 2. Metadata (Context)
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated: ${format(new Date(), "MMM dd, yyyy HH:mm")}`, 14, 30);
  doc.text(`Period: ${timeframe}`, 14, 36);
  doc.text(`User Scope: ${userFilter}`, 14, 42);

  // 3. Calculate Totals for the PDF Summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  // 4. Add Summary Box
  doc.setDrawColor(200);
  doc.setFillColor(245, 247, 250);
  doc.rect(14, 50, 180, 25, "FD"); // Filled & Draw rect
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Total Income", 20, 60);
  doc.text("Total Expenses", 80, 60);
  doc.text("Net Balance", 140, 60);

  doc.setFontSize(14);
  doc.setTextColor(0); // Black
  doc.text(`$${totalIncome.toFixed(2)}`, 20, 68);
  doc.setTextColor(220, 38, 38); // Red
  doc.text(`$${totalExpense.toFixed(2)}`, 80, 68);
  
  const balance = totalIncome - totalExpense;
  doc.setTextColor(balance >= 0 ? 22 : 220, balance >= 0 ? 163 : 38, balance >= 0 ? 74 : 38); // Green or Red
  doc.text(`$${balance.toFixed(2)}`, 140, 68);

  // 5. Table Data
  const tableRows = transactions.map(t => [
    format(new Date(t.date), "MMM dd, yyyy"),
    t.profiles?.full_name || "Unknown",
    t.category,
    t.name || "-",
    t.type.toUpperCase(),
    `$${Math.abs(t.amount).toFixed(2)}`
  ]);

  // 6. Generate Table
  autoTable(doc, {
    startY: 85,
    head: [["Date", "User", "Category", "Description", "Type", "Amount"]],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // Blue header
    styles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [249, 250, 251] }
  });

  // 7. Save
  doc.save(`Expense_Report_${timeframe.replace(/\s/g, "_")}.pdf`);
}