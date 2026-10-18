package com.codealpha.trading;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CodeAlpha Java Programming Internship — Task 2
 * Project Title: Stock Trading Platform
 * Main Spring Boot Application Entry Point
 */
@SpringBootApplication
public class StockTradingApplication {

    public static void main(String[] args) {
        SpringApplication.run(StockTradingApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" CodeAlpha Stock Trading Platform Backend Started");
        System.out.println(" REST API URL: http://localhost:8080/api/stocks");
        System.out.println(" H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}
