### Container Lifecycle Management System

## Overview

The Container Lifecycle Management System is a full-stack web application designed to manage the movement and lifecycle of reusable production containers within a controlled pharmaceutical manufacturing environment.

The application digitises the complete container lifecycle by enforcing business rules, managing QA and Supervisor approval workflows, maintaining a comprehensive audit trail, and providing real-time operational dashboards and analytics. A built-in simulation engine generates realistic operational data to support testing, evaluation, and reporting.


## Technologies

# Frontend
React
Material UI
Chart.js
Axios

# Backend
Node.js
Express.js
JWT Authentication
REST API

# Database
MySQL

# Testing
Jest

# Development Tools
Visual studio code
Git and GitHub
Thunder Client
MySQL Workbench


## Features
User authentication and role based access
container lifecycle management
workflow enforcement
QA and Supervisor approvals
Automatic lefecycle expiry based on production use and calendar days
Operational dashboard
Operational Analytics
QR code and barcode Scanning
Movement History and autit logging
Simulation engine for operational data generation


# Analytics

SQL Reporting
Operational Dashboard
Lifecycle usage
Movement trends
Operational KPI reporting

# Future Enhancements

Extend predictive analytics using larger operational datasets
Introduce regression analysis using long term historical lifecycle data
Develop machine learning models to forecast better container utilisation
Integrate with Manufacturing Execution Systems(MES) or ERP platforms
Implement automated notifications for QA approvals and lifecycle expiry

# Key business rules
Containers require QA approval before their first introduction to production
Containers may be used for a maximum of 14 production runs
Containers remain valid for a maximum of 30 calendar days per lifecycle
The 14th production run is allowed, the 15th attempt will automatically expire 
Expired containers are automatically sent to cleaning
Supervisor approval is required before a new lifecycle can begin
Every container movement is recored to provide complete traceability

## Author
Fergal Hughes
Higher Diploma in Science(Software Development)
