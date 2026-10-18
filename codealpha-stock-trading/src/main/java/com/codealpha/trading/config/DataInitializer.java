package com.codealpha.trading.config;

import com.codealpha.trading.model.Stock;
import com.codealpha.trading.model.User;
import com.codealpha.trading.repository.StockRepository;
import com.codealpha.trading.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(StockRepository stockRepository, UserRepository userRepository) {
        return args -> {
            // Seed default user if not existing
            if (userRepository.count() == 0) {
                User defaultUser = new User("codealpha_trader", "CodeAlpha Intern Trader", "trader@codealpha.edu", new BigDecimal("100000.00"));
                userRepository.save(defaultUser);
                System.out.println(">>> Initialized default trader user with ₹100,000 virtual balance.");
            }

            // Seed required 10 stocks if not existing
            if (stockRepository.count() == 0) {
                List<Stock> initialStocks = Arrays.asList(
                        new Stock("TCS", "Tata Consultancy Services", new BigDecimal("3920.50"), new BigDecimal("45.20"), new BigDecimal("1.17"), "INR", "Information Technology"),
                        new Stock("INFY", "Infosys Limited", new BigDecimal("1634.80"), new BigDecimal("-12.40"), new BigDecimal("-0.75"), "INR", "Information Technology"),
                        new Stock("RELIANCE", "Reliance Industries Ltd.", new BigDecimal("2980.00"), new BigDecimal("32.50"), new BigDecimal("1.10"), "INR", "Energy & Telecom"),
                        new Stock("HDFCBANK", "HDFC Bank Ltd.", new BigDecimal("1445.60"), new BigDecimal("8.90"), new BigDecimal("0.62"), "INR", "Banking & Finance"),
                        new Stock("WIPRO", "Wipro Limited", new BigDecimal("482.30"), new BigDecimal("-3.15"), new BigDecimal("-0.65"), "INR", "Information Technology"),
                        new Stock("ICICIBANK", "ICICI Bank Ltd.", new BigDecimal("1088.75"), new BigDecimal("14.30"), new BigDecimal("1.33"), "INR", "Banking & Finance"),
                        new Stock("AAPL", "Apple Inc.", new BigDecimal("182.50"), new BigDecimal("2.10"), new BigDecimal("1.16"), "USD", "Consumer Electronics"),
                        new Stock("MSFT", "Microsoft Corporation", new BigDecimal("420.25"), new BigDecimal("-1.85"), new BigDecimal("-0.44"), "USD", "Software & Cloud"),
                        new Stock("AMZN", "Amazon.com Inc.", new BigDecimal("178.90"), new BigDecimal("3.40"), new BigDecimal("1.94"), "USD", "E-Commerce & Cloud"),
                        new Stock("GOOGL", "Alphabet Inc. (Google)", new BigDecimal("156.40"), new BigDecimal("1.65"), new BigDecimal("1.07"), "USD", "Internet & AI")
                );

                stockRepository.saveAll(initialStocks);
                System.out.println(">>> Seeded 10 sample stocks into H2/MySQL database.");
            }
        };
    }
}
