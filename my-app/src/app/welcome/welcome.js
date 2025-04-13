"use client";

import React from "react";
import "./welcome.css";

export default function Welcome() {
    const handleGetStartedClick = () => {
        window.location.href = "/login";
    };

    return (
        <div className="container">
            {/* Header and About Us Section */}
            <div className="background-container">
                <div className="header">
                    <h1 className="welcome">Welcome to Golden Crop Distributors Ltd.</h1>
                    <p className="tagline">
                        Modernizing produce distribution with efficient procurement, sales, stock, and analytics solutions.
                    </p>
                    <button
                        className="login-button"
                        onClick={handleGetStartedClick}
                    >
                        Get Started
                    </button>
                </div>

                {/* About Us Section */}
                <div className="introduction">
                    <h2>ABOUT US</h2>
                    <p>
                        Golden Crop Distributors Ltd. (GCDL) is a leading wholesale produce distributor specializing in cereals. 
                        With operations across Uganda, we are committed to providing efficient procurement, sales, and stock 
                        management solutions to our customers. Our mission is to modernize operations and deliver exceptional 
                        value to our stakeholders.
                    </p>
                </div>
            </div>

            {/* Features Section */}
            <div className="activity-grid">
                {/* Procurement Management */}
                <div className="activity-card">
                    <img
                        src="https://media.istockphoto.com/id/1364117418/photo/young-african-businesswoman-or-accountant-pushing-buttons-of-calculator.jpg?s=1024x1024&w=is&k=20&c=hRgM3hWjRr9_p2m5GJtXa93WFw1pKJjJtxkV0FaLjxQ="
                        alt="Procurement Management"
                    />
                    <h3>Procurement Management</h3>
                    <p>
                        Record and manage produce details, including tonnage, cost, dealer information, and selling price.
                    </p>
                </div>

                {/* Sales Management */}
                <div className="activity-card">
                    <img
                        src="https://images.pexels.com/photos/7693242/pexels-photo-7693242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Sales Management"
                    />
                    <h3>Sales Management</h3>
                    <p>
                        Track sales details, generate receipts, and manage buyer information with ease.
                    </p>
                </div>

                {/* Credit Sales Management */}
                <div className="activity-card">
                    <img
                        src="https://media.istockphoto.com/id/1400561010/photo/cash-payment.jpg?s=1024x1024&w=is&k=20&c=BjenqJaofJlvqt9Nu0KD6d6u9DKgtEgazRruvxuE94I="
                        alt="Credit Sales Management"
                    />
                    <h3>Credit Sales Management</h3>
                    <p>
                        Manage credit sales with buyer details, national ID, location, and due dates.
                    </p>
                </div>

                {/* Stock Management */}
                <div className="activity-card">
                    <img
                        src="https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                        alt="Stock Management"
                    />
                    <h3>Stock Management</h3>
                    <p>
                        Automatically update stock levels after sales and allow record editing.
                    </p>
                </div>

                {/* Analytics & Reporting */}
                <div className="activity-card">
                    <img
                        src="https://images.pexels.com/photos/7414035/pexels-photo-7414035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Analytics & Reporting"
                    />
                    <h3>Analytics & Reporting</h3>
                    <p>
                        Interactive dashboards and reports for sales trends, profit margins, and stock turnover.
                    </p>
                </div>

                {/* Crops We Deal In */}
                <div className="activity-card">
                    <img
                        src="https://media.istockphoto.com/id/1020544828/photo/dried-food-products-on-the-african-street-market.jpg?s=1024x1024&w=is&k=20&c=ZAAKTnNuVz9yCCpLdpFkavwdDSVcnYJRAtOJ0DIbhRc="
                        alt="Crops We Deal In"
                    />
                    <h3>Crops We Deal In</h3>
                    <p>
                        We specialize in beans, grain maize, cowpeas, groundnuts (G-nuts), rice, and soybeans, sourced from trusted dealers and farms.
                    </p>
                </div>
            </div>
        </div>
    );
}