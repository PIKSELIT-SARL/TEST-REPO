# PILOTINE - Wage Bill Monitoring Application

A specialized management application designed for monitoring and forecasting the wage bill (masse salariale) for an entity.

## Overview

PILOTINE functions as a cockpit by establishing a highly secure, read-only connection with the external payroll platform MY SILAE, demanding rigorous Multi-Factor Authentication (MFA) to protect the sensitive financial information it handles.

### Features

- **Secure Authentication**: MFA-protected login with MY SILAE integration
- **Dashboard**: Real-time financial indicators and KPIs
- **Simulation Module**: Model strategic HR decisions for individual employees
  - Salary adjustments
  - Employee exits and replacements
  - ETP (Full-Time Equivalent) modifications
- **Projections**: Visualize projected payroll data and ETP numbers
- **Variance Analysis**: Calculate precise financial variance from reference salary base

## Technology Stack

- HTML5
- CSS3 with [Franken UI](https://franken-ui.dev/) styling
- Vanilla JavaScript
- UIkit 3 for interactive components

## Project Structure

```
├── index.html          # Login/MFA page
├── dashboard.html      # Main dashboard with financial indicators
├── simulation.html     # HR decision simulation module
├── projections.html    # Projected payroll and ETP data
├── assets/
│   ├── css/
│   │   └── style.css   # Custom styles
│   └── js/
│       ├── app.js      # Main application logic
│       └── simulation.js # Simulation module logic
├── images/             # Image assets
└── files/              # Downloadable files and exports
```

## Getting Started

1. Clone this repository
2. Open `index.html` in a web browser
3. Use any email/password combination to access (demo mode)
4. Enter any 6-digit code for MFA verification

## Screenshots

### Login Page
Secure MFA-protected authentication screen

### Dashboard
Financial indicators including:
- Annual wage bill
- Total ETP (Full-Time Equivalent)
- Average cost per ETP
- Employer charges

### Simulation Module
Interactive forms for modeling:
- Salary adjustments (percentage or fixed amount)
- Employee departures (resignation, retirement, dismissal)
- Replacements with cost comparison
- ETP modifications

### Projections
- Reference vs Projected comparison charts
- Monthly ETP evolution
- Detailed variance breakdown by action
- Monthly projection table

## MVP Note

This is a Minimum Viable Product (MVP) for client presentation. It includes:
- Fully functional navigation
- Interactive forms with live calculations
- Sample data for demonstration
- Responsive design for all screen sizes

## License

Private - For demonstration purposes only