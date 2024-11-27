Project Features and Instructions
Here are the detailed features and instructions for your entire project.

1. User Management
Features:
User Registration: Ability for new users to register.
User Role Management: Users will have different roles, such as Administrator, Manager, and Customer, with role-based access control.
Activate/Deactivate User: Ability to activate or deactivate users.
Reset Password: Ability to reset a user’s password.
Instructions:
Register Users: Go to Admin Panel → Users and add a new user.
Activate/Deactivate: In the Users List, use the Activate/Deactivate button to change the user status.
Password Reset: Use the Reset Password button to set a new password for the user.
2. Account Management
Features:
Account Types: Users can create Checking, Savings, and Loan accounts.
Activate/Deactivate Accounts: Ability to activate or deactivate accounts.
View Account Details: View detailed information of any account.
Instructions:
Create Account: Go to Admin Panel → Accounts to create a new account by selecting the user and account type.
Activate/Deactivate Account: Use the Activate/Deactivate button in the Accounts List to change the account status.
View Account Details: Click View Details to see the detailed information of an account.
3. Transaction Management
Features:
Deposit and Withdrawal: Users can deposit or withdraw money from Checking and Savings accounts.
Monthly Limits and Restrictions: Define withdrawal limits for Checking and Savings accounts.
Transaction History: View the history of all transactions made in an account.
Instructions:
Deposit/Withdrawal: Go to Admin Panel → Transactions to perform deposits or withdrawals.
View Transaction History: Select an account to view its transaction history.
4. Loan Management
Features:
Apply for Loan: Customers can apply for loans.
Loan Approval: Administrators can approve or reject loan applications.
Repayment Schedule: View and manage loan repayment schedules.
Penalty Calculation: Calculate penalties for late payments.
Instructions:
Loan Application: Customers can apply for a loan from the Loan Application page.
Loan Approval: Administrators can approve or reject loans from the Admin Panel → Loan Approval page.
View Repayment Schedule: View the repayment schedule for each loan.
Pay Installment: Customers can pay installments from the Repayment Schedule page.
5. Savings Plans
Features:
Fixed Deposit (FD): Deposit a fixed amount for a specific period to earn interest.
Recurring Deposit (RD): Regular monthly deposits with interest earnings.
Interest Calculation: Calculate interest on deposits.
Automated Interest Credit: Interest is credited automatically to the accounts.
Instructions:
Enroll in Savings Plans: Go to the Savings Plans page to enroll in Fixed or Recurring Deposit plans.
View Interest Logs: Go to the Interest Logs page to view interest details for each plan.
6. Reports and Statements
Features:
Monthly Statement: Generate monthly statements showing account activity.
Detailed Report: Generate detailed reports on account summaries, loan balances, and transaction history.
Export as PDF/Excel: Download statements in PDF or Excel formats.
Instructions:
View Monthly Statement: Go to Reports → Monthly Statement to view a detailed monthly statement.
View Detailed Report: Go to Reports → Detailed Report to see detailed reports.
Download Reports: Download reports as PDF or Excel by clicking Export as PDF or Export as Excel.
7. Dashboard
Features:
Account Summary: View total balance, loan balance, and savings plan summary.
Quick Actions: Shortcuts to perform actions like transactions, loan application, and account creation.
Instructions:
Dashboard: After logging in, navigate to the Dashboard page to view summaries and quick action shortcuts.
8. Access Control
Features:
Role-Based Access Control: Users will have access to different features based on their roles.
Administrator Privileges: Administrators will have full access to all features.
Customer Privileges: Customers can only view their own accounts, loans, and transactions.
Instructions:
Role-Based Menu: The menu options will be filtered based on user roles, allowing only authorized roles to see the corresponding options.
Project Navigation
Menu Structure:
Dashboard
Users (Administrator Only)
Accounts
Transactions
Loan Application
Loan Approval (Administrator Only)
Savings Plans
Interest Logs
Reports
Monthly Statement
Detailed Report
9. Reporting and Export
Features:
Monthly Statement: Generate statements that show all transactions for the month.
Detailed Report: Generate reports on account balances, loan details, and transactions.
Export to PDF and Excel: Download reports in PDF or Excel format for offline use.
Instructions:
View and Export Reports: Go to Reports to view monthly or detailed reports and use the Export as PDF/Excel buttons to download them.
10. Menu Structure
The menu is designed to provide clear access to different sections for different roles (Administrator, Manager, and Customer). Here's a summary of the Admin Panel menu structure:

Dashboard
Users (For Administrator only)
Accounts (For Administrator and Manager)
Transactions (For all roles)
Loan Application (For all roles)
Loan Approval (For Administrator and Manager)
Savings Plans (For Administrator and Manager)
Interest Logs (For Administrator and Manager)
Reports
Monthly Statement
Detailed Report
Key Considerations
Role-Based UI Changes: The application will dynamically change the available options in the menu based on the user's role.
Data Privacy: Users can only see their own accounts and transactions, while administrators have access to all data.
Error Handling: Clear error messages should be displayed when something goes wrong, like failed login or submission of incorrect data.
