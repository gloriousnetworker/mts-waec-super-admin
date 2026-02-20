Mega Tech Solutions - Super Admin Dashboard

A comprehensive super administration dashboard for managing schools, administrators, and students across the WAEC CBT simulation platform for Kogi State Ministry of Education.

Live Demo: https://mts-waec-super-admin.vercel.app/
Features
🎯 Core Features

    School Management: Register and manage all schools in the system

    Admin Management: Create and manage school administrators

    Student Overview: View all students across the state

    Report Generation: Generate comprehensive reports for the Ministry of Education

    Support Tickets: Manage and respond to school admin support requests

    Advanced Analytics: State-wide performance metrics and insights

📊 Administrative Features

    School Registration: Add new schools with complete details

    Admin Creation: Create admin accounts for schools with default password 123456

    Subscription Management: Track admin subscriptions (Monthly, Termly, Yearly, Unlimited)

    Expiry Tracking: Automatic account deactivation on subscription expiry

    Golden Badge: Special indicator for Unlimited Version admins

    Revenue Tracking: Monitor subscription payments and total revenue

    Report Generation: Export reports in CSV/JSON formats

    Support Ticket System: Respond to admin inquiries with chat functionality

    Performance Analytics: State-wide performance dashboards

📊 Subscription Plans

    Monthly: ₦15,000 - 30 days access

    Termly: ₦42,000 - 120 days access

    Yearly: ₦120,000 - 365 days access

    Unlimited: ₦500,000 - Lifetime access with golden badge

📱 Dashboard Sections

    Home: State-wide statistics and quick actions

    Schools: Complete school management

    Admins: Admin account management with subscriptions

    Students: View all students across the state

    Reports: Generate and download reports

    Support: Support ticket management

    Analytics: Advanced performance analytics

    Settings: System configuration

    Help: Resources and documentation

Tech Stack
Frontend

    Next.js 14 - React framework with App Router

    React - UI library

    Framer Motion - Animation library

    Tailwind CSS - Utility-first CSS framework

Key Dependencies

    next: ^14.0.0

    react: ^18.0.0

    framer-motion: ^10.0.0

    react-hot-toast: ^2.4.0

    next/image: Built-in image optimization

Installation
Prerequisites

    Node.js 18.0 or higher

    npm or yarn package manager

Setup Instructions

    Clone the repository
    bash

git clone https://github.com/yourusername/mts-waec-super-admin.git
cd mts-waec-super-admin

Install dependencies
bash

npm install
# or
yarn install

Run the development server
bash

npm run dev
# or
yarn dev

    Open your browser
    Navigate to http://localhost:3000

Project Structure
text

mts-waec-super-admin/
├── app/
│   ├── superadmin/
│   │   ├── layout.jsx           # Super admin layout
│   │   ├── page.jsx             # Landing page with splash
│   │   ├── login/               # Super admin login
│   │   └── dashboard/            # Super admin dashboard
│   │       └── page.jsx         # Main dashboard
├── components/
│   ├── superadmin/
│   │   ├── Navbar.jsx           # Super admin navigation
│   │   ├── Sidebar.jsx          # Super admin sidebar
│   │   ├── Home.jsx             # Dashboard home
│   │   ├── Schools.jsx          # Schools management
│   │   ├── Admins.jsx           # Admins management with subscriptions
│   │   ├── Students.jsx         # Students overview
│   │   ├── Reports.jsx          # Report generation
│   │   ├── Support.jsx          # Support ticket management
│   │   ├── Analytics.jsx        # Advanced analytics
│   │   ├── Settings.jsx         # System settings
│   │   ├── Help.jsx             # Help resources
│   │   └── SuperAdminChat.jsx   # Support chat
│   ├── SplashScreen.jsx         # App loading screen
│   └── ProtectedRoute.jsx       # Route protection HOC
├── context/
│   └── AuthContext.jsx          # Authentication context
├── public/
│   ├── icons/                   # PWA icons
│   ├── logo.png                 # Mega Tech logo
│   └── manifest.json            # PWA manifest
├── styles/
│   ├── globals.css              # Global styles
│   └── styles.js                # Component styles
└── package.json

Usage Guide
For Super Administrators
Getting Started

    Access the App

        Visit the live URL or open locally

        Splash screen appears with loading progress

    Login

        Use credentials provided by Mega Tech Solutions

        Demo credentials available:

            Email: admin@megatechsolutions.org

            Password: megatech2024

School Management

    Register a New School

        Navigate to Schools section

        Click "Add New School"

        Fill in school details (name, address, contact)

        School added to system

    View Schools

        List of all registered schools

        Filter by status (active/inactive)

        View number of admins and students per school

Admin Management

    Create New Admin

        Navigate to Admins section

        Click "Add New Admin"

        Fill in admin details:

            Name, Email, Phone (required)

            Select school

            Choose role (Admin, Vice Principal, Principal)

            Set permissions

            Select subscription plan

        Default password: 123456

        Admin receives login credentials

    Subscription Management

        Each admin has subscription details:

            Plan (Monthly, Termly, Yearly, Unlimited)

            Status (Active, Expired)

            Start and expiry dates

            Amount paid

            Payment method

        Auto-deactivation: Expired accounts automatically deactivated

        Reactivate: Click reactivate button for expired admins

        Golden Badge: Unlimited version admins get 🌟 badge

    Track Subscriptions

        View subscription statistics on dashboard

        Filter admins by plan type

        Monitor days remaining for active subscriptions

        Track total revenue from all admins

Report Generation

    Generate Reports

        Navigate to Reports section

        Select report type:

            School Report

            Student Report

            Performance Report

            Ministry Report

            Admin Report

            Exam Report

        Choose date range

        Select format (CSV, JSON)

        Click "Generate Report"

        Report downloads automatically

    Report Contents

        School reports: School names, student counts, admin counts, pass rates

        Ministry reports: LGA breakdown with statistics

        Performance reports: State-wide metrics

Support Ticket System

    View Tickets

        Navigate to Support section

        Tickets displayed with status (open, in-progress, closed)

        Filter by status or search by ID/school

        View priority levels (high, medium, low)

    Respond to Tickets

        Click on any ticket to open modal

        View full conversation history

        Type reply in textarea

        Send response to school admin

        Close ticket when resolved

    Create New Ticket to School

        Click "New Ticket to School"

        Select school

        Add subject, category, priority, description

        Send to school admin

Analytics Dashboard

    View Performance Metrics

        Overall statistics (students, schools, admins, exams)

        Top performing schools

        Subject performance breakdown

        LGA-wise comparison

        Monthly trends

    Key Metrics

        Average scores

        Pass rates

        Active users

        New registrations

        Performance insights

Subscription Auto-Deactivation

The system automatically checks subscription expiry:

    Daily check: When loading admin list

    Expired accounts: Status changes to 'expired'

    Deactivation: Expired admins cannot access their dashboards

    Reactivation: Super admin can reactivate by updating subscription

PWA Features

The app is a Progressive Web Application with:

    Installable: Add to home screen on mobile devices

    Offline Support: Access previously loaded content offline

    Fast Loading: Optimized for quick startup

    Responsive Design: Works on all screen sizes

To install:

    Mobile: Open in Chrome/Safari → Share menu → Add to Home Screen

    Desktop: Click install icon in address bar

Demo Credentials

For testing purposes:

    Email: admin@megatechsolutions.org

    Password: megatech2024

Alternative demo:

    Email: commissioner@kogimoe.gov.ng

    Password: megatech2024

Roadmap
Phase 1 (Completed)

    School management

    Admin creation with subscriptions

    Subscription tracking and expiry

    Report generation

    Support ticket system

Phase 2 (In Progress)

    Payment gateway integration

    Automated renewal reminders

    Advanced financial reporting

    Multi-currency support

Phase 3 (Planned)

    Real-time notifications

    Custom branding for schools

    API access for integrations

    Mobile app for super admins

Support

For technical support, contact the Mega Tech Solutions development team.

Built for Kogi State Ministry of Education in alliance with Mega Tech Solutions.

© 2026 Mega Tech Solutions. All rights reserved.

Built with ❤️ for Kogi State Ministry of Education