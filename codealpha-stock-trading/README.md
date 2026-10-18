# Stock Trading Platform — CodeAlpha Java Programming Internship (Task 2)

![Project Status](https://img.shields.io/badge/CodeAlpha-Task%202%20Completed-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-green)
![Database](https://img.shields.io/badge/Database-H2%20%7C%20MySQL-blue)
![Build](https://img.shields.io/badge/Build-Maven-red)

A simulated stock market trading platform developed for the **CodeAlpha Java Programming Internship — Task 2**. This enterprise-grade application simulates a real-world stock market environment where users can view live fluctuating simulated prices, buy and sell shares with strict real-time transactional validation, manage their portfolio, calculate profit/loss, and audit their complete transaction ledger.

---

## 1. Table of Contents
1. [Core Features](#core-features)
2. [Technology Stack](#technology-stack)
3. [Object-Oriented Programming (OOP) Architecture](#object-oriented-programming-oop-architecture)
4. [Project Directory Structure](#project-directory-structure)
5. [Prerequisites](#prerequisites)
6. [Step-by-Step Setup & Execution](#step-by-step-setup--execution)
   - [Running in IntelliJ IDEA](#running-in-intellij-idea)
   - [Running in VS Code](#running-in-vs-code)
   - [Running via Terminal / Command Prompt](#running-via-terminal--command-prompt)
7. [Database Configuration & H2 Console](#database-configuration--h2-console)
8. [REST API Documentation & Endpoints](#rest-api-documentation--endpoints)
9. [Automated Unit Testing & Test Cases](#automated-unit-testing--test-cases)
10. [Submission & Internship Criteria](#submission--internship-criteria)

---

## 2. Core Features

### A. User Dashboard
- **Virtual Cash Balance**: Starts with **₹100,000.00** virtual trading cash.
- **Total Portfolio Value**: Dynamic calculation of cash + market value of all stock holdings.
- **Profit / Loss Metrics**: Instant unrealized and realized P&L with positive/negative color indicators.
- **Holdings Counter**: Number of distinct company shares currently owned.
- **Recent Activity**: Quick audit of recent trades.

### B. Stock Market Simulation
- **10 Sample Stocks** seeded by default:
  1. `TCS` — Tata Consultancy Services (₹3,920.50)
  2. `INFY` — Infosys Limited (₹1,634.80)
  3. `RELIANCE` — Reliance Industries Ltd. (₹2,980.00)
  4. `HDFCBANK` — HDFC Bank Ltd. (₹1,445.60)
  5. `WIPRO` — Wipro Limited (₹482.30)
  6. `ICICIBANK` — ICICI Bank Ltd. (₹1,088.75)
  7. `AAPL` — Apple Inc. ($182.50)
  8. `MSFT` — Microsoft Corporation ($420.25)
  9. `AMZN` — Amazon.com Inc. ($178.90)
  10. `GOOGL` — Alphabet Inc. / Google ($156.40)
- **Simulated Market Price Fluctuations**: Market tick simulation with percentage changes.
- **Clear Simulated Labeling**: Explicitly marked to avoid confusion with live exchanges.
- **Search & Sort**: Filter by name, symbol, or sort by current price and gainers/losers.

### C. Buy Stock Execution
- Real-time order value calculation (`quantity × currentPrice`).
- Strict balance check: Throws `InsufficientBalanceException` if total cost > available cash.
- Deducts cash atomically and adds/updates holding in `PortfolioItem` using weighted average price.
- Logs an immutable `BUY` record in the `transactions` table.

### D. Sell Stock Execution
- Ownership verification: Throws `InsufficientStockException` if user attempts to sell more shares than owned.
- Credits proceeds to user's virtual balance.
- Decrements holding quantity or deletes entry if quantity reaches 0.
- Logs an immutable `SELL` record in the `transactions` table.

### E. Portfolio Management
- Tracks: Symbol, Company Name, Quantity Owned, Average Purchase Price, Current Simulated Price, Total Invested, Current Value, and Unrealized P&L ($ and %).

### F. Transaction Audit History
- Permanent transaction ledger with Transaction ID, Symbol, Type (BUY/SELL), Quantity, Execution Price, Total Value, and Timestamp.
- Filtering by All, Buy, or Sell.

---

## 3. Technology Stack

- **Backend**: Java 17, Spring Boot 3.2.3, Spring Data JPA, Hibernate, Jakarta Validation
- **Database**: H2 (Embedded In-Memory, default) or MySQL 8.0+
- **Build Tool**: Apache Maven 3.8+
- **Testing**: JUnit 5, Mockito
- **Frontend**: Responsive Single-Page Application (HTML5, Tailwind CSS, TypeScript / React, Lucide Icons)

---

## 4. Object-Oriented Programming (OOP) Architecture

The project strictly follows core OOP principles:

| OOP Concept | Implementation in this Project |
| :--- | :--- |
| **Abstraction** | `AbstractFinancialAsset` defines the blueprint for any tradable asset, mandating polymorphic calculation of valuation via `calculateValuation(int units)`. |
| **Inheritance** | `Stock extends AbstractFinancialAsset`, inheriting asset identity (`symbol`, `companyName`, `currency`) while adding equity-specific metrics. |
| **Encapsulation** | All entities (`User`, `Stock`, `PortfolioItem`, `Transaction`) declare private fields. The `User` balance cannot be directly mutated; it is protected by business methods `deductCash(BigDecimal)` and `addCash(BigDecimal)` with invariant enforcement. |
| **Polymorphism** | Abstract methods overridden in asset subclasses; standard interfaces (`StockRepository`, `PortfolioRepository`, `TransactionRepository`) decoupling data access. |

---

## 5. Project Directory Structure

```
codealpha-stock-trading/
├── pom.xml                                    # Maven Dependencies & Build Configuration
├── README.md                                  # Complete Documentation & Setup Guide
└── src/
    ├── main/
    │   ├── java/com/codealpha/trading/
    │   │   ├── StockTradingApplication.java   # Spring Boot Main Application Entry
    │   │   ├── config/
    │   │   │   ├── DataInitializer.java       # Database Seeding (User & 10 Stocks)
    │   │   │   └── WebMvcConfig.java          # CORS Configuration for Frontend Access
    │   │   ├── controller/
    │   │   │   └── StockTradingController.java# REST API Controller
    │   │   ├── dto/
    │   │   │   ├── PortfolioSummaryResponse.java
    │   │   │   ├── TradeRequest.java
    │   │   │   └── TradeResponse.java
    │   │   ├── exception/
    │   │   │   ├── GlobalExceptionHandler.java
    │   │   │   ├── InsufficientBalanceException.java
    │   │   │   ├── InsufficientStockException.java
    │   │   │   └── StockNotFoundException.java
    │   │   ├── model/
    │   │   │   ├── AbstractFinancialAsset.java# Abstraction & Inheritance Base
    │   │   │   ├── PortfolioItem.java         # Encapsulated Holding Entity
    │   │   │   ├── Stock.java                 # Stock Entity extending AbstractFinancialAsset
    │   │   │   ├── Transaction.java           # Transaction Ledger Entity
    │   │   │   ├── TransactionType.java       # BUY / SELL Enum
    │   │   │   └── User.java                  # Encapsulated User & Balance Entity
    │   │   ├── repository/
    │   │   │   ├── PortfolioRepository.java   # JPA Data Access for Holdings
    │   │   │   ├── StockRepository.java       # JPA Data Access for Stocks
    │   │   │   ├── TransactionRepository.java # JPA Data Access for Transactions
    │   │   │   └── UserRepository.java        # JPA Data Access for Users
    │   │   └── service/
    │   │       ├── PortfolioService.java      # Portfolio Logic & P&L Calculation
    │   │       ├── StockService.java          # Stock Retrieval & Market Simulation
    │   │       ├── TradingService.java        # Atomic Buy/Sell Transaction Engine
    │   │       └── TransactionService.java    # Audit Log Management
    │   └── resources/
    │       ├── application.properties         # Server & Database Settings
    │       ├── data.sql                       # Initial Stock & User Seed SQL
    │       └── schema.sql                     # DDL Database Schema Script
    └── test/
        └── java/com/codealpha/trading/
            └── TradingServiceTest.java        # JUnit 5 & Mockito Unit Tests
```

---

## 6. Step-by-Step Setup & Execution

### Prerequisites
- **JDK 17 or higher** installed (`java -version`).
- **Maven 3.8+** installed (`mvn -version`) or use the Maven wrapper in IntelliJ.

### Running via Terminal / Command Prompt
```bash
# Navigate to the project directory
cd codealpha-stock-trading

# Clean and compile the application
mvn clean compile

# Run the Spring Boot application
mvn spring-boot:run
```
Once started, the backend runs on `http://localhost:8080`.

### Running in IntelliJ IDEA
1. Open IntelliJ IDEA -> Select **File** -> **Open...**
2. Choose the `codealpha-stock-trading` folder containing `pom.xml`.
3. Wait for IntelliJ to sync Maven dependencies (indicated in bottom status bar).
4. Navigate to `src/main/java/com/codealpha/trading/StockTradingApplication.java`.
5. Right-click anywhere in the file and select **Run 'StockTradingApplication.main()'**.

### Running in VS Code
1. Install the **Extension Pack for Java** in VS Code.
2. Open the `codealpha-stock-trading` folder.
3. Open `StockTradingApplication.java` and click the **Run** button above `main()`.

---

## 7. Database Configuration & H2 Console

By default, an in-memory **H2 Database** is configured for instant zero-configuration execution.

- **H2 Console URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:stockdb`
- **User Name**: `sa`
- **Password**: *(leave blank)*

### Switching to MySQL (Optional)
In `src/main/resources/application.properties`, uncomment the MySQL block:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stock_trading_db?createDatabaseIfNotExist=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

---

## 8. REST API Documentation & Endpoints

### 1. Get All Stocks
- **Endpoint**: `GET /api/stocks`
- **Description**: Returns all 10 sample stocks with current prices and daily changes.
- **Sample Response**:
```json
[
  {
    "id": 1,
    "symbol": "TCS",
    "companyName": "Tata Consultancy Services",
    "currentPrice": 3920.50,
    "dailyPriceChange": 45.20,
    "dailyChangePercentage": 1.17,
    "currency": "INR",
    "sector": "Information Technology"
  }
]
```

### 2. Execute Buy Order
- **Endpoint**: `POST /api/trade/buy`
- **Request Body**:
```json
{
  "userId": 1,
  "symbol": "TCS",
  "quantity": 5
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Successfully purchased 5 shares of TCS (Tata Consultancy Services) for INR 19602.50",
  "transactionId": 1,
  "symbol": "TCS",
  "companyName": "Tata Consultancy Services",
  "transactionType": "BUY",
  "quantity": 5,
  "executionPrice": 3920.50,
  "totalAmount": 19602.50,
  "remainingVirtualCash": 80397.50,
  "timestamp": "2026-10-18T10:15:30"
}
```
- **Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": "INSUFFICIENT_FUNDS",
  "message": "Insufficient cash balance to buy 100 shares of TCS. Required: INR 392050.00, Available: INR 100000.00",
  "timestamp": "2026-10-18T10:15:32"
}
```

### 3. Execute Sell Order
- **Endpoint**: `POST /api/trade/sell`
- **Request Body**:
```json
{
  "userId": 1,
  "symbol": "TCS",
  "quantity": 2
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Successfully sold 2 shares of TCS (Tata Consultancy Services) for INR 7841.00",
  "transactionId": 2,
  "symbol": "TCS",
  "transactionType": "SELL",
  "quantity": 2,
  "executionPrice": 3920.50,
  "totalAmount": 7841.00,
  "remainingVirtualCash": 88238.50
}
```

### 4. Get Portfolio Summary
- **Endpoint**: `GET /api/portfolio/{userId}`
- **Description**: Returns user's total net worth, invested capital, unrealized P&L, and breakdown of holdings.

### 5. Get Transaction History
- **Endpoint**: `GET /api/transactions/{userId}` or `GET /api/transactions/{userId}?type=BUY`
- **Description**: Retrieves audit trail of completed trades.

### 6. Simulate Market Price Tick
- **Endpoint**: `POST /api/stocks/simulate-tick`
- **Description**: Dynamically fluctuates prices across all stocks to simulate realistic market conditions.

---

## 9. Automated Unit Testing & Test Cases

Run the automated test suite with Maven:
```bash
mvn test
```

The test suite in `TradingServiceTest.java` verifies:
1. `testBuyStock_Success`: Verifies cash deduction, holding update, and transaction logging.
2. `testBuyStock_InsufficientFunds`: Confirms transactions fail and throw `InsufficientBalanceException` when funds are lacking.
3. `testSellStock_Success`: Confirms proceeds are credited and holdings reduced.
4. `testSellStock_InsufficientShares`: Ensures selling more shares than owned throws `InsufficientStockException`.

---

## 10. Submission & Internship Evaluation

Developed by **CodeAlpha Java Programming Intern**  
Project: **Stock Trading Platform (Task 2)**  
Submission Includes: Full Java OOP architecture, Spring Boot REST controllers, JPA persistence, transactional safety, JUnit tests, and interactive UI dashboard.
