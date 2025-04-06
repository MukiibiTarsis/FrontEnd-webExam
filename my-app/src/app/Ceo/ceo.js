"use client"; // Mark this as a client component

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic"; // Import dynamic from Next.js
import html2canvas from "html2canvas"; // For PDF export
import jsPDF from "jspdf"; // For PDF export
import * as XLSX from "xlsx"; // For Excel export
import "./ceo.css";

// Dynamically import the Chart component with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Export the Ceo component
export default function Ceo() {
  // State to track the active section
  const [activeSection, setActiveSection] = useState("overview");

  // Ref for the final report div (to capture for PDF export)
  const reportRef = useRef();

  // Hardcoded data with monthly values for profitMargin, stockTurnover, and procurement
  const initialData = {
    overview: {
      combinedEvents: 15,
      totalSales: 500000,
      profitMargin: 20,
      stockTurnover: 3.5,
      procurement: 300000,
      branchComparison: {
        branch1: {
          sales: 300000,
          profitMargin: 22,
          stockTurnover: 4,
        },
        branch2: {
          sales: 200000,
          profitMargin: 18,
          stockTurnover: 3,
        },
      },
    },
    branch1: {
      events: 8,
      salesTrends: [45000, 48000, 50000, 52000, 55000, 60000], // Jan to Jun
      profitMargin: [20, 21, 22, 23, 24, 25], // Jan to Jun
      stockTurnover: [3.8, 3.9, 4.0, 4.1, 4.2, 4.3], // Jan to Jun
      procurement: [170000, 175000, 180000, 185000, 190000, 195000], // Jan to Jun
      creditSales: 50000,
      dealerPerformance: 85,
      salesAgentPerformance: 5000,
      buyersAnalysis: { buyerId: "1234", amount: 10000 },
      invoices: 120,
    },
    branch2: {
      events: 7,
      salesTrends: [40000, 39000, 38000, 37000, 36000, 35000], // Jan to Jun
      profitMargin: [16, 17, 18, 19, 20, 21], // Jan to Jun
      stockTurnover: [2.8, 2.9, 3.0, 3.1, 3.2, 3.3], // Jan to Jun
      procurement: [110000, 115000, 120000, 125000, 130000, 135000], // Jan to Jun
      creditSales: 30000,
      dealerPerformance: 78,
      salesAgentPerformance: 3000,
      buyersAnalysis: { buyerId: "5678", amount: 8000 },
      invoices: 90,
    },
  };

  // State to store dashboard data (initially hardcoded)
  const [dashboardData] = useState(initialData);

  // State for the add manager form
  const [managerForm, setManagerForm] = useState({
    name: "",
    email: "",
    branch: "Branch 1", // Default branch
  });

  // Function to show the Overview section
  const showOverview = () => {
    setActiveSection("overview");
  };

  // Function to show a specific branch section
  const showBranch = (branchName) => {
    if (branchName === "Branch 1") {
      setActiveSection("branch1");
    } else if (branchName === "Branch 2") {
      setActiveSection("branch2");
    }
  };

  // Handle form input changes for adding a manager
  const handleManagerInputChange = (e) => {
    const { name, value } = e.target;
    setManagerForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to add a manager
  const handleAddManager = (e) => {
    e.preventDefault();
    // Basic validation
    if (!managerForm.name || !managerForm.email) {
      alert("Please fill in all required fields (Name and Email).");
      return;
    }

    // Create a new manager object (not displayed, but could be sent to a backend)
    const newManager = {
      id: Date.now(), // Simple ID generation (in a real app, this would come from the backend)
      name: managerForm.name,
      email: managerForm.email,
      branch: managerForm.branch,
    };

    // Reset the form
    setManagerForm({
      name: "",
      email: "",
      branch: "Branch 1",
    });

    alert("Manager added successfully!");
    // In a real application, you would send this data to the backend API here
  };

  // Export to PDF
  const exportToPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("final-report.pdf");
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const data = [
      ["Metric", "Value"],
      ["Combined Events", dashboardData.overview.combinedEvents],
      ["Total Sales ($)", dashboardData.overview.totalSales],
      ["Profit Margin (%)", dashboardData.overview.profitMargin],
      ["Stock Turnover (times/year)", dashboardData.overview.stockTurnover],
      ["Procurement ($)", dashboardData.overview.procurement],
      ["", ""], // Spacer
      ["Branch 1 Sales (Jan-Jun)", branch1TotalSales],
      ["Branch 2 Sales (Jan-Jun)", branch2TotalSales],
      ["Branch 1 Profit Margin (%)", dashboardData.overview.branchComparison.branch1.profitMargin],
      ["Branch 2 Profit Margin (%)", dashboardData.overview.branchComparison.branch2.profitMargin],
      ["Branch 1 Stock Turnover (times/year)", dashboardData.overview.branchComparison.branch1.stockTurnover],
      ["Branch 2 Stock Turnover (times/year)", dashboardData.overview.branchComparison.branch2.stockTurnover],
      ["Branch 1 Procurement ($)", dashboardData.branch1.procurement.reduce((sum, value) => sum + value, 0)],
      ["Branch 2 Procurement ($)", dashboardData.branch2.procurement.reduce((sum, value) => sum + value, 0)],
    ];

    const csvContent = data.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "final-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to Excel
  const exportToExcel = () => {
    const data = [
      ["Metric", "Value"],
      ["Combined Events", dashboardData.overview.combinedEvents],
      ["Total Sales ($)", dashboardData.overview.totalSales],
      ["Profit Margin (%)", dashboardData.overview.profitMargin],
      ["Stock Turnover (times/year)", dashboardData.overview.stockTurnover],
      ["Procurement ($)", dashboardData.overview.procurement],
      ["", ""], // Spacer
      ["Branch 1 Sales (Jan-Jun)", branch1TotalSales],
      ["Branch 2 Sales (Jan-Jun)", branch2TotalSales],
      ["Branch 1 Profit Margin (%)", dashboardData.overview.branchComparison.branch1.profitMargin],
      ["Branch 2 Profit Margin (%)", dashboardData.overview.branchComparison.branch2.profitMargin],
      ["Branch 1 Stock Turnover (times/year)", dashboardData.overview.branchComparison.branch1.stockTurnover],
      ["Branch 2 Stock Turnover (times/year)", dashboardData.overview.branchComparison.branch2.stockTurnover],
      ["Branch 1 Procurement ($)", dashboardData.branch1.procurement.reduce((sum, value) => sum + value, 0)],
      ["Branch 2 Procurement ($)", dashboardData.branch2.procurement.reduce((sum, value) => sum + value, 0)],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Final Report");
    XLSX.writeFile(wb, "final-report.xlsx");
  };

  // Calculate total sales for each branch over the past months (sum of salesTrends)
  const branch1TotalSales = dashboardData.branch1.salesTrends.reduce((sum, value) => sum + value, 0);
  const branch2TotalSales = dashboardData.branch2.salesTrends.reduce((sum, value) => sum + value, 0);

  // Overview Pie Charts (unchanged)
  const salesTrendsPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: [branch1TotalSales, branch2TotalSales],
    labels: ["Branch 1", "Branch 2"],
    title: {
      text: "Sales Trends (Jan-Jun)",
      align: "center",
    },
    colors: ["#36A2EB", "#FF6384"],
    legend: {
      position: "bottom",
    },
  };

  const profitMarginPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: [
      dashboardData.overview.branchComparison.branch1.profitMargin,
      dashboardData.overview.branchComparison.branch2.profitMargin,
    ],
    labels: ["Branch 1", "Branch 2"],
    title: {
      text: "Profit Margin (%)",
      align: "center",
    },
    colors: ["#36A2EB", "#FF6384"],
    legend: {
      position: "bottom",
    },
  };

  const stockTurnoverPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: [
      dashboardData.overview.branchComparison.branch1.stockTurnover,
      dashboardData.overview.branchComparison.branch2.stockTurnover,
    ],
    labels: ["Branch 1", "Branch 2"],
    title: {
      text: "Stock Turnover (times/year)",
      align: "center",
    },
    colors: ["#36A2EB", "#FF6384"],
    legend: {
      position: "bottom",
    },
  };

  const procurementPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: [
      dashboardData.branch1.procurement.reduce((sum, value) => sum + value, 0),
      dashboardData.branch2.procurement.reduce((sum, value) => sum + value, 0),
    ],
    labels: ["Branch 1", "Branch 2"],
    title: {
      text: "Procurement ($)",
      align: "center",
    },
    colors: ["#36A2EB", "#FF6384"],
    legend: {
      position: "bottom",
    },
  };

  // Branch 1 Pie Charts
  // Sales Trends Pie Chart (Branch 1) - Already monthly
  const branch1SalesTrendsPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: dashboardData.branch1.salesTrends,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    title: {
      text: "Branch 1 Sales Trends (Jan-Jun)",
      align: "center",
    },
    colors: ["#36A2EB", "#4BC0C0", "#FFCE56", "#E7E9ED", "#FF9F40", "#9966FF"],
    legend: {
      position: "bottom",
    },
  };

  // Profit Margin Pie Chart (Branch 1) - Updated to show monthly data
  const branch1ProfitMarginPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: dashboardData.branch1.profitMargin,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    title: {
      text: "Branch 1 Profit Margin (%) (Jan-Jun)",
      align: "center",
    },
    colors: ["#36A2EB", "#4BC0C0", "#FFCE56", "#E7E9ED", "#FF9F40", "#9966FF"],
    legend: {
      position: "bottom",
    },
  };

  // Stock Turnover Pie Chart (Branch 1) - Updated to show monthly data
  const branch1StockTurnoverPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: dashboardData.branch1.stockTurnover,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    title: {
      text: "Branch 1 Stock Turnover (times/year) (Jan-Jun)",
      align: "center",
    },
    colors: ["#36A2EB", "#4BC0C0", "#FFCE56", "#E7E9ED", "#FF9F40", "#9966FF"],
    legend: {
      position: "bottom",
    },
  };

  // Procurement Pie Chart (Branch 1) - Updated to show monthly data
  const branch1ProcurementPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: dashboardData.branch1.procurement,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    title: {
      text: "Branch 1 Procurement ($) (Jan-Jun)",
      align: "center",
    },
    colors: ["#36A2EB", "#4BC0C0", "#FFCE56", "#E7E9ED", "#FF9F40", "#9966FF"],
    legend: {
      position: "bottom",
    },
  };

  // Branch 2 Pie Charts
  // Sales Trends Pie Chart (Branch 2) - Already monthly
  const branch2SalesTrendsPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: dashboardData.branch2.salesTrends,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    title: {
      text: "Branch 2 Sales Trends (Jan-Jun)",
      align: "center",
    },
    colors: ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#FF9F40", "#9966FF"],
    legend: {
      position: "bottom",
    },
  };

  // Profit Margin Pie Chart (Branch 2) - Updated to show monthly data
  const branch2ProfitMarginPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: dashboardData.branch2.profitMargin,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    title: {
      text: "Branch 2 Profit Margin (%) (Jan-Jun)",
      align: "center",
    },
    colors: ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#FF9F40", "#9966FF"],
    legend: {
      position: "bottom",
    },
  };

  // Stock Turnover Pie Chart (Branch 2) - Updated to show monthly data
  const branch2StockTurnoverPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: dashboardData.branch2.stockTurnover,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    title: {
      text: "Branch 2 Stock Turnover (times/year) (Jan-Jun)",
      align: "center",
    },
    colors: ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#FF9F40", "#9966FF"],
    legend: {
      position: "bottom",
    },
  };

  // Procurement Pie Chart (Branch 2) - Updated to show monthly data
  const branch2ProcurementPieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    series: dashboardData.branch2.procurement,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    title: {
      text: "Branch 2 Procurement ($) (Jan-Jun)",
      align: "center",
    },
    colors: ["#FF6384", "#4BC0C0", "#FFCE56", "#E7E9ED", "#FF9F40", "#9966FF"],
    legend: {
      position: "bottom",
    },
  };

  // Chart options for Branch 1 Sales Trends (Line Chart) - Unchanged
  const branch1SalesChartOptions = {
    chart: {
      type: "line",
      height: 300,
    },
    series: [
      {
        name: "Sales ($)",
        data: dashboardData.branch1.salesTrends,
      },
    ],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      title: {
        text: "Month",
      },
    },
    yaxis: {
      title: {
        text: "Sales ($)",
      },
    },
    title: {
      text: "Branch 1 Sales Trends",
      align: "center",
    },
    colors: ["#36A2EB"],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 5,
    },
  };

  // Chart options for Branch 2 Sales Trends (Line Chart) - Unchanged
  const branch2SalesChartOptions = {
    chart: {
      type: "line",
      height: 300,
    },
    series: [
      {
        name: "Sales ($)",
        data: dashboardData.branch2.salesTrends,
      },
    ],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      title: {
        text: "Month",
      },
    },
    yaxis: {
      title: {
        text: "Sales ($)",
      },
    },
    title: {
      text: "Branch 2 Sales Trends",
      align: "center",
    },
    colors: ["#FF6384"],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 5,
    },
  };

  return (
    <React.Fragment>
      <div className="container">
        {/* Header with Menu */}
        <div className="header">
          <h1>Welcome Back CEO</h1>
          <div className="menu">
            <button onClick={showOverview} className={activeSection === "overview" ? "active" : ""}>
              Overview
            </button>
            <button onClick={() => showBranch("Branch 1")} className={activeSection === "branch1" ? "active" : ""}>
              Branch 1
            </button>
            <button onClick={() => showBranch("Branch 2")} className={activeSection === "branch2" ? "active" : ""}>
              Branch 2
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Add Manager Form */}
          <div className="add-manager-form">
            <h2>Add a Manager</h2>
            <form onSubmit={handleAddManager}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={managerForm.name}
                  onChange={handleManagerInputChange}
                  placeholder="e.g., John Doe"
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={managerForm.email}
                  onChange={handleManagerInputChange}
                  placeholder="e.g., john.doe@example.com"
                  required
                />
              </label>
              <label>
                Branch:
                <select
                  name="branch"
                  value={managerForm.branch}
                  onChange={handleManagerInputChange}
                >
                  <option value="Branch 1">Branch 1</option>
                  <option value="Branch 2">Branch 2</option>
                </select>
              </label>
              <button type="submit">Add Manager</button>
            </form>
          </div>

          {/* Dashboard Content */}
          <div id="content">
            {/* Overview Section */}
            <div id="overview" className={`section ${activeSection === "overview" ? "active" : ""}`}>
              <h2>Overview of Both Branches</h2>
              <div className="final-report" ref={reportRef}>
                <p>Combined Events: {dashboardData.overview.combinedEvents} events across both branches.</p>
                <p>Total Sales: ${dashboardData.overview.totalSales.toLocaleString()}</p>
                <p>Profit Margin: {dashboardData.overview.profitMargin}%</p>
                <p>Stock Turnover: {dashboardData.overview.stockTurnover} times/year</p>
                <p>Procurement: ${dashboardData.overview.procurement.toLocaleString()}</p>

                {/* Pie Charts for Overview */}
                <div className="charts-container">
                  <div className="chart-wrapper">
                    <Chart
                      options={salesTrendsPieOptions}
                      series={salesTrendsPieOptions.series}
                      type="pie"
                      height={300}
                    />
                  </div>
                  <div className="chart-wrapper">
                    <Chart
                      options={profitMarginPieOptions}
                      series={profitMarginPieOptions.series}
                      type="pie"
                      height={300}
                    />
                  </div>
                  <div className="chart-wrapper">
                    <Chart
                      options={stockTurnoverPieOptions}
                      series={stockTurnoverPieOptions.series}
                      type="pie"
                      height={300}
                    />
                  </div>
                  <div className="chart-wrapper">
                    <Chart
                      options={procurementPieOptions}
                      series={procurementPieOptions.series}
                      type="pie"
                      height={300}
                    />
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="export-buttons">
                <button onClick={exportToPDF}>Export to PDF</button>
                <button onClick={exportToCSV}>Export to CSV</button>
                <button onClick={exportToExcel}>Export to Excel</button>
              </div>
            </div>

            {/* Branch 1 Section */}
            <div id="branch1" className={`section ${activeSection === "branch1" ? "active" : ""}`}>
              <h2>Branch 1 Details</h2>
              <p>Sales Trends: ${dashboardData.branch1.salesTrends[dashboardData.branch1.salesTrends.length - 1].toLocaleString()} (up 10%)</p>
              <Chart
                options={branch1SalesChartOptions}
                series={branch1SalesChartOptions.series}
                type="line"
                height={300}
              />

              {/* Pie Charts for Branch 1 */}
              <div className="charts-container">
                <div className="chart-wrapper">
                  <Chart
                    options={branch1SalesTrendsPieOptions}
                    series={branch1SalesTrendsPieOptions.series}
                    type="pie"
                    height={300}
                  />
                </div>
                <div className="chart-wrapper">
                  <Chart
                    options={branch1ProfitMarginPieOptions}
                    series={branch1ProfitMarginPieOptions.series}
                    type="pie"
                    height={300}
                  />
                </div>
                <div className="chart-wrapper">
                  <Chart
                    options={branch1StockTurnoverPieOptions}
                    series={branch1StockTurnoverPieOptions.series}
                    type="pie"
                    height={300}
                  />
                </div>
                <div className="chart-wrapper">
                  <Chart
                    options={branch1ProcurementPieOptions}
                    series={branch1ProcurementPieOptions.series}
                    type="pie"
                    height={300}
                  />
                </div>
              </div>

              <p>Profit Margin (Average): {(dashboardData.branch1.profitMargin.reduce((sum, value) => sum + value, 0) / dashboardData.branch1.profitMargin.length).toFixed(2)}%</p>
              <p>Stock Turnover (Average): {(dashboardData.branch1.stockTurnover.reduce((sum, value) => sum + value, 0) / dashboardData.branch1.stockTurnover.length).toFixed(2)} times/year</p>
              <p>Procurement (Total): ${dashboardData.branch1.procurement.reduce((sum, value) => sum + value, 0).toLocaleString()}</p>
              <p>
                Provision for Expiry: <a href="#">Download PDF</a> | <a href="#">Download CSV</a> |{" "}
                <a href="#">Download Excel</a>
              </p>
              <p>Credit Sales Report: ${dashboardData.branch1.creditSales.toLocaleString()} outstanding</p>
              <p>Dealer Performance: {dashboardData.branch1.dealerPerformance}% efficiency</p>
              <p>Sales Agent Performance: ${dashboardData.branch1.salesAgentPerformance.toLocaleString()} paid</p>
              <p>Buyers Analysis: Buyer ID #{dashboardData.branch1.buyersAnalysis.buyerId} - ${dashboardData.branch1.buyersAnalysis.amount.toLocaleString()}</p>
              <p>Invoices: {dashboardData.branch1.invoices} invoices issued</p>
            </div>

            {/* Branch 2 Section */}
            <div id="branch2" className={`section ${activeSection === "branch2" ? "active" : ""}`}>
              <h2>Branch 2 Details</h2>
              <p>Sales Trends: ${dashboardData.branch2.salesTrends[dashboardData.branch2.salesTrends.length - 1].toLocaleString()} (down 5%)</p>
              <Chart
                options={branch2SalesChartOptions}
                series={branch2SalesChartOptions.series}
                type="line"
                height={300}
              />

              {/* Pie Charts for Branch 2 */}
              <div className="charts-container">
                <div className="chart-wrapper">
                  <Chart
                    options={branch2SalesTrendsPieOptions}
                    series={branch2SalesTrendsPieOptions.series}
                    type="pie"
                    height={300}
                  />
                </div>
                <div className="chart-wrapper">
                  <Chart
                    options={branch2ProfitMarginPieOptions}
                    series={branch2ProfitMarginPieOptions.series}
                    type="pie"
                    height={300}
                  />
                </div>
                <div className="chart-wrapper">
                  <Chart
                    options={branch2StockTurnoverPieOptions}
                    series={branch2StockTurnoverPieOptions.series}
                    type="pie"
                    height={300}
                  />
                </div>
                <div className="chart-wrapper">
                  <Chart
                    options={branch2ProcurementPieOptions}
                    series={branch2ProcurementPieOptions.series}
                    type="pie"
                    height={300}
                  />
                </div>
              </div>

              <p>Profit Margin (Average): {(dashboardData.branch2.profitMargin.reduce((sum, value) => sum + value, 0) / dashboardData.branch2.profitMargin.length).toFixed(2)}%</p>
              <p>Stock Turnover (Average): {(dashboardData.branch2.stockTurnover.reduce((sum, value) => sum + value, 0) / dashboardData.branch2.stockTurnover.length).toFixed(2)} times/year</p>
              <p>Procurement (Total): ${dashboardData.branch2.procurement.reduce((sum, value) => sum + value, 0).toLocaleString()}</p>
              <p>
                Provision for Expiry: <a href="#">Download PDF</a> | <a href="#">Download CSV</a> |{" "}
                <a href="#">Download Excel</a>
              </p>
              <p>Credit Sales Report: ${dashboardData.branch2.creditSales.toLocaleString()} outstanding</p>
              <p>Dealer Performance: {dashboardData.branch2.dealerPerformance}% efficiency</p>
              <p>Sales Agent Performance: ${dashboardData.branch2.salesAgentPerformance.toLocaleString()} paid</p>
              <p>Buyers Analysis: Buyer ID #{dashboardData.branch2.buyersAnalysis.buyerId} - ${dashboardData.branch2.buyersAnalysis.amount.toLocaleString()}</p>
              <p>Invoices: {dashboardData.branch2.invoices} invoices issued</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}