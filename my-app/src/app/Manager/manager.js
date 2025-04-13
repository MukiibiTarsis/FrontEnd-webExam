"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import * as Papa from "papaparse";
import "./manager.css";

export default function Dashboard({ userRole = "manager" }) {
  // Mock data for branches and receipts
  const initialBranchData = {
    branch1: {
      salesTrends: "Up 5%",
      profitMargin: "12%",
      stockTurnover: "3.2x",
      procurementCosts: "$15,000",
      report: "Branch 1: Strong performance, sales up, costs stable.",
    },
    branch2: {
      salesTrends: "Down 2%",
      profitMargin: "8%",
      stockTurnover: "2.8x",
      procurementCosts: "$18,000",
      report: "Branch 2: Sales declining, needs cost optimization.",
    },
  };

  const initialReceipts = [
    { amount: "$500", receiptID: "R001", salesAgentID: "SA01", buyerID: "B001", procedure: "Cash" },
    { amount: "$300", receiptID: "R002", salesAgentID: "SA02", buyerID: "B002", procedure: "Credit" },
  ];

  // State for dynamic data
  const [branchData, setBranchData] = useState(initialBranchData);
  const [receipts, setReceipts] = useState(initialReceipts);
  const [selectedBranch, setSelectedBranch] = useState("branch1");
  const [metrics, setMetrics] = useState(initialBranchData.branch1);
  const [dataTable, setDataTable] = useState([
    { metric: "Sales Trends", value: initialBranchData.branch1.salesTrends },
    { metric: "Profit Margin", value: initialBranchData.branch1.profitMargin },
    { metric: "Stock Turnover", value: initialBranchData.branch1.stockTurnover },
    { metric: "Procurement Costs", value: initialBranchData.branch1.procurementCosts },
  ]);
  const [loading, setLoading] = useState(false);

  const dashboardRef = useRef(null);

  // Update metrics and dataTable when the selected branch changes
  useEffect(() => {
    if (branchData[selectedBranch]) {
      setMetrics(branchData[selectedBranch]);
      setDataTable([
        { metric: "Sales Trends", value: branchData[selectedBranch].salesTrends || "" },
        { metric: "Profit Margin", value: branchData[selectedBranch].profitMargin || "" },
        { metric: "Stock Turnover", value: branchData[selectedBranch].stockTurnover || "" },
        { metric: "Procurement Costs", value: branchData[selectedBranch].procurementCosts || "" },
      ]);
    }
  }, [selectedBranch, branchData]);

  // Handle branch selection
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  // Handle data table value change
  const handleValueChange = (index, newValue) => {
    const updatedData = [...dataTable];
    updatedData[index].value = newValue;
    setDataTable(updatedData);
  };

  // Save row data and update local state
  const saveRow = (index) => {
    const metric = dataTable[index].metric;
    const value = dataTable[index].value;
    alert(`Saved: ${metric} = ${value}`);

    // Update the local branchData state
    const updatedBranchData = { ...branchData };
    if (metric === "Sales Trends") updatedBranchData[selectedBranch].salesTrends = value;
    if (metric === "Profit Margin") updatedBranchData[selectedBranch].profitMargin = value;
    if (metric === "Stock Turnover") updatedBranchData[selectedBranch].stockTurnover = value;
    if (metric === "Procurement Costs") updatedBranchData[selectedBranch].procurementCosts = value;
    setBranchData(updatedBranchData);
    setMetrics(updatedBranchData[selectedBranch]);
  };

  // Export to PDF
  const exportToPDF = () => {
    const element = dashboardRef.current;
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dashboard.pdf");
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const data = [
      { metric: "Sales Trends", value: metrics.salesTrends },
      { metric: "Profit Margin", value: metrics.profitMargin },
      { metric: "Stock Turnover", value: metrics.stockTurnover },
      { metric: "Procurement Costs", value: metrics.procurementCosts },
      ...receipts,
    ];

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dashboard.csv";
    link.click();
  };

  // Export to Excel
  const exportToExcel = () => {
    const data = [
      { Metric: "Sales Trends", Value: metrics.salesTrends },
      { Metric: "Profit Margin", Value: metrics.profitMargin },
      { Metric: "Stock Turnover", Value: metrics.stockTurnover },
      { Metric: "Procurement Costs", Value: metrics.procurementCosts },
      ...receipts,
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard");
    XLSX.writeFile(wb, "dashboard.xlsx");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <Head>
        <title>{userRole === "manager" ? "Sales Manager Dashboard" : "CEO Dashboard"}</title>
      </Head>
      <div className="container" ref={dashboardRef}>
        <h1>{userRole === "manager" ? "Sales Manager Dashboard" : "CEO Dashboard"}</h1>

        {/* Branch Selection */}
        <label htmlFor="branchSelect">Select Branch:</label>
        <select id="branchSelect" value={selectedBranch} onChange={handleBranchChange}>
          {Object.keys(branchData).map((branch) => (
            <option key={branch} value={branch}>
              {branch.charAt(0).toUpperCase() + branch.slice(1)}
            </option>
          ))}
        </select>

        {/* Data Input Section (Managers Only) */}
        {userRole === "manager" && (
          <>
            <h2>Data Input</h2>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataTable.map((row, index) => (
                  <tr key={index}>
                    <td>{row.metric}</td>
                    <td
                      contentEditable
                      onBlur={(e) => handleValueChange(index, e.target.textContent)}
                      suppressContentEditableWarning={true}
                    >
                      {row.value}
                    </td>
                    <td>
                      <button onClick={() => saveRow(index)}>Save</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Metrics Section */}
        <h2>Metrics</h2>
        <div className="metrics">
          <div className="metric-card">
            <h3>Sales Trends</h3>
            <p>{metrics.salesTrends || "N/A"}</p>
          </div>
          <div className="metric-card">
            <h3>Profit Margin</h3>
            <p>{metrics.profitMargin || "N/A"}</p>
          </div>
          <div className="metric-card">
            <h3>Stock Turnover</h3>
            <p>{metrics.stockTurnover || "N/A"}</p>
          </div>
          <div className="metric-card">
            <h3>Procurement Costs</h3>
            <p>{metrics.procurementCosts || "N/A"}</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="export-buttons">
          <button onClick={exportToPDF}>Export to PDF</button>
          <button onClick={exportToCSV}>Export to CSV</button>
          <button onClick={exportToExcel}>Export to Excel</button>
        </div>

        {/* Report Section */}
        <h2>Branch Report (CEO View)</h2>
        <div>
          <p>{metrics.report || "No report available."}</p>
        </div>

        {/* Receipts Section */}
        <h2>Receipts</h2>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>ReceiptID</th>
              <th>SalesAgentID</th>
              <th>BuyerID</th>
              <th>Procedure</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt, index) => (
              <tr key={index}>
                <td>{receipt.amount}</td>
                <td>{receipt.receiptID}</td>
                <td>{receipt.salesAgentID}</td>
                <td>{receipt.buyerID}</td>
                <td>{receipt.procedure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}