### Container Lifecycle Management System

## Overview
The Container Lifecycle Management System is a full-stack web application designed to manage the movement and lifecycle of reusable production containers within a controlled pharmaceutical manufacturing environment.

The application digitises the container lifecycle by enforcing business rules, managing QA and Supervisor approval workflows, maintaining container movement and approval records, and providing operational dashboards and analytics.

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
Supertest

# Development Tools
Visual studio code
Git and GitHub
Thunder Client
MySQL Workbench


## Installation and setup
The following software is required to run the application
Node.js
npm
MySQL
Git

## Source Code

The complete sorce code is available on git
https://github.com/ferghugh/Container-Lifecycle-Management-System.git 

## install frontend packages
cd frontend
npm install
npm run dev

## install backend packages
cd backend
npm install
npm run dev

## Run automated tests
cd backend
npm test


## Features

User authentication and role-based access control
Container lifecycle npm test
Workflow validation and enforcement
QA and Supervisor approval workflows
Automatic lifecycle expiry based on production use and calendar duration
Operational dashboard
Operational analytics
QR code and barcode scanning
Container movement history

# Analytics

SQL Reporting
Operational Dashboard
Lifecycle usage
Movement trends
Operational KPI reporting

## Future Enhancements

Introduce regression analysis using larger volumes of historical lifecycle data
Develop machine learning models to forecast container utilisation
Integrate with Manufacturing Execution Systems (MES) or ERP platforms
Implement automated notifications for QA approvals and lifecycle expiry
Introduce comprehensive audit logging for system actions and approval activity

# Key business rules
Containers require QA approval before their first introduction to production
Containers may be used for a maximum of 14 production runs
Containers remain valid for a maximum of 30 calendar days per lifecycle
The 14th production run is allowed, the 15th attempt will automatically expire the container lifecycle
Expired containers are automatically sent to Cleaning
Supervisor approval is required before a new lifecycle can begin
Container movements are recored to provide traceabiblity throughout the container lifecycle.

# Project Status
The project has been completed as part of the Higher Diploma in Science (Software Development). 
The application demonstrates a complete container lifecycle, including workflow validation, approval management, operational dashboards, movement history, and QR code scanning and operational reporting.

# Demonstration
https://youtu.be/nl5k9i7cOBM

## Author
Fergal Hughes
Higher Diploma in Science(Software Development)

