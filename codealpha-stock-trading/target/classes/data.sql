-- Sample Seed Data for CodeAlpha Stock Trading Platform
-- Default User with 100,000 INR Virtual Cash
INSERT INTO users (id, username, full_name, email, virtual_cash_balance)
VALUES (1, 'codealpha_trader', 'CodeAlpha Intern Trader', 'trader@codealpha.edu', 100000.00)
ON DUPLICATE KEY UPDATE id=id;

-- 10 Required Stocks (Indian blue-chips & Global tech leaders)
-- TCS, Infosys, Reliance Industries, HDFC Bank, Wipro, ICICI Bank, Apple, Microsoft, Amazon, Google
INSERT INTO stocks (id, symbol, company_name, current_price, daily_price_change, daily_change_percentage, currency, sector)
VALUES 
(1, 'TCS', 'Tata Consultancy Services', 3920.50, 45.20, 1.17, 'INR', 'Information Technology'),
(2, 'INFY', 'Infosys Limited', 1634.80, -12.40, -0.75, 'INR', 'Information Technology'),
(3, 'RELIANCE', 'Reliance Industries Ltd.', 2980.00, 32.50, 1.10, 'INR', 'Energy & Telecom'),
(4, 'HDFCBANK', 'HDFC Bank Ltd.', 1445.60, 8.90, 0.62, 'INR', 'Banking & Finance'),
(5, 'WIPRO', 'Wipro Limited', 482.30, -3.15, -0.65, 'INR', 'Information Technology'),
(6, 'ICICIBANK', 'ICICI Bank Ltd.', 1088.75, 14.30, 1.33, 'INR', 'Banking & Finance'),
(7, 'AAPL', 'Apple Inc.', 182.50, 2.10, 1.16, 'USD', 'Consumer Electronics'),
(8, 'MSFT', 'Microsoft Corporation', 420.25, -1.85, -0.44, 'USD', 'Software & Cloud'),
(9, 'AMZN', 'Amazon.com Inc.', 178.90, 3.40, 1.94, 'USD', 'E-Commerce & Cloud'),
(10, 'GOOGL', 'Alphabet Inc. (Google)', 156.40, 1.65, 1.07, 'USD', 'Internet & AI')
ON DUPLICATE KEY UPDATE id=id;
