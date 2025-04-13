"use client";
"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import * as Papa from "papaparse";
import "./manager.css";

export default function Manager({ userRole = "manager" }) {
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

  // Updated mock data for receipts to match Receipt Control fields
  const initialReceipts = [
    { receiptID: "R001", amountPaid: "$500", salesAgentName: "Agent 1", buyerName: "Buyer 1" },
    { receiptID: "R002", amountPaid: "$300", salesAgentName: "Agent 2", buyerName: "Buyer 2" },
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
  const [openDropdown, setOpenDropdown] = useState(null);

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

    const updatedBranchData = { ...branchData };
    if (metric === "Sales Trends") updatedBranchData[selectedBranch].salesTrends = value;
    if (metric === "Profit Margin") updatedBranchData[selectedBranch].profitMargin = value;
    if (metric === "Stock Turnover") updatedBranchData[selectedBranch].stockTurnover = value;
    if (metric === "Procurement Costs") updatedBranchData[selectedBranch].procurementCosts = value;
    setBranchData(updatedBranchData);
    setMetrics(updatedBranchData[selectedBranch]);
  };

  // Toggle dropdown visibility
  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  // Save receipt data from Receipt Control dropdown
  const saveReceipt = (receiptData) => {
    const newReceipt = {
      receiptID: receiptData.receiptID,
      amountPaid: receiptData.amountPaid,
      salesAgentName: receiptData.salesAgentName,
      buyerName: receiptData.buyerName,
    };
    setReceipts([...receipts, newReceipt]);
    alert("Receipt Control Saved");
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

        {/* Dropdown Buttons for Different Sections */}
        {userRole === "manager" && (
          <>
            <h2>Data Input Sections</h2>

            {/* Stock Management */}
            <div>
              <button onClick={() => toggleDropdown("stockManagement")}>
                Stock Management {openDropdown === "stockManagement" ? "▲" : "▼"}
              </button>
              {openDropdown === "stockManagement" && (
                <div className="dropdown-content">
                  <label>Product Name: <input type="text" placeholder="Enter Product Name" /></label><br />
                  <label>Product ID: <input type="text" placeholder="Enter Product ID" /></label><br />
                  <label>Tonnage Sold: <input type="text" placeholder="Enter Tonnage Sold" /></label><br />
                  <label>Tonnage Bought: <input type="text" placeholder="Enter Tonnage Bought" /></label><br />
                  <label>Current Tonnage: <input type="text" placeholder="Enter Current Tonnage" /></label><br />
                  <button onClick={() => alert("Stock Management Saved")}>Save</button>
                </div>
              )}
            </div>

            {/* Sales Management */}
            <div>
              <button onClick={() => toggleDropdown("salesManagement")}>
                Sales Management {openDropdown === "salesManagement" ? "▲" : "▼"}
              </button>
              {openDropdown === "salesManagement" && (
                <div className="dropdown-content">
                  <label>Sales ID: <input type="text" placeholder="Enter Sales ID" /></label><br />
                  <label>Product Name: <input type="text" placeholder="Enter Product Name" /></label><br />
                  <label>Tonnage: <input type="text" placeholder="Enter Tonnage" /></label><br />
                  <label>Amount Paid: <input type="text" placeholder="Enter Amount Paid" /></label><br />
                  <label>Buyer’s Name: <input type="text" placeholder="Enter Buyer’s Name" /></label><br />
                  <label>Sales Agent Name: <input type="text" placeholder="Enter Sales Agent Name" /></label><br />
                  <label>Rate: <input type="text" placeholder="Enter Rate" /></label><br />
                  <label>Time: <input type="text" placeholder="Enter Time" /></label><br />
                  <label>Buyer Contact: <input type="text" placeholder="Enter Buyer Contact" /></label><br />
                  <button onClick={() => alert("Sales Management Saved")}>Save</button>
                </div>
              )}
            </div>

            {/* Receipt Control */}
            <div>
              <button onClick={() => toggleDropdown("receiptControl")}>
                Receipt Control {openDropdown === "receiptControl" ? "▲" : "▼"}
              </button>
              {openDropdown === "receiptControl" && (
                <div className="dropdown-content">
                  <label>Receipt ID: <input id="receiptID" type="text" placeholder="Enter Receipt ID" /></label><br />
                  <label>Amount Paid: <input id="amountPaid" type="text" placeholder="Enter Amount Paid" /></label><br />
                  <label>Sales Agent Name: <input id="salesAgentName" type="text" placeholder="Enter Sales Agent Name" /></label><br />
                  <label>Buyer’s Name: <input id="buyerName" type="text" placeholder="Enter Buyer’s Name" /></label><br />
                  <button
                    onClick={() => {
                      const receiptData = {
                        receiptID: document.getElementById("receiptID").value,
                        amountPaid: document.getElementById("amountPaid").value,
                        salesAgentName: document.getElementById("salesAgentName").value,
                        buyerName: document.getElementById("buyerName").value,
                      };
                      saveReceipt(receiptData);
                    }}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Credit/Sale */}
            <div>
              <button onClick={() => toggleDropdown("creditSale")}>
                Credit/Sale {openDropdown === "creditSale" ? "▲" : "▼"}
              </button>
              {openDropdown === "creditSale" && (
                <div className="dropdown-content">
                  <label>Buyer’s Name: <input type="text" placeholder="Enter Buyer’s Name" /></label><br />
                  <label>Amount Due: <input type="text" placeholder="Enter Amount Due" /></label><br />
                  <label>Location: <input type="text" placeholder="Enter Location" /></label><br />
                  <label>Due Date: <input type="text" placeholder="Enter Due Date" /></label><br />
                  <label>Product ID: <input type="text" placeholder="Enter Product ID" /></label><br />
                  <button onClick={() => alert("Credit/Sale Saved")}>Save</button>
                </div>
              )}
            </div>

            {/* Data */}
            <div>
              <button onClick={() => toggleDropdown("data")}>
                Data {openDropdown === "data" ? "▲" : "▼"}
              </button>
              {openDropdown === "data" && (
                <div className="dropdown-content">
                  <label>Product ID: <input type="text" placeholder="Enter Product ID" /></label><br />
                  <label>Product Name: <input type="text" placeholder="Enter Product Name" /></label><br />
                  <label>Type: <input type="text" placeholder="Enter Type" /></label><br />
                  <label>Date: <input type="text" placeholder="Enter Date" /></label><br />
                  <label>Time: <input type="text" placeholder="Enter Time" /></label><br />
                  <label>Tonnage Cost: <input type="text" placeholder="Enter Tonnage Cost" /></label><br />
                  <label>Branch/Contact: <input type="text" placeholder="Enter Branch/Contact" /></label><br />
                  <label>Dealer Note: <input type="text" placeholder="Enter Dealer Note" /></label><br />
                  <label>Selling Price: <input type="text" placeholder="Enter Selling Price" /></label><br />
                  <button onClick={() => alert("Data Saved")}>Save</button>
                </div>
              )}
            </div>
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
              <th>Receipt ID</th>
              <th>Amount Paid</th>
              <th>Sales Agent Name</th>
              <th>Buyer’s Name</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt, index) => (
              <tr key={index}>
                <td>{receipt.receiptID}</td>
                <td>{receipt.amountPaid}</td>
                <td>{receipt.salesAgentName}</td>
                <td>{receipt.buyerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}