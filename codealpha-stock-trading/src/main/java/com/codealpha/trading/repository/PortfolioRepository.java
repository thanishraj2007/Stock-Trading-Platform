package com.codealpha.trading.repository;

import com.codealpha.trading.model.PortfolioItem;
import com.codealpha.trading.model.Stock;
import com.codealpha.trading.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<PortfolioItem, Long> {
    List<PortfolioItem> findByUserId(Long userId);
    Optional<PortfolioItem> findByUserAndStock(User user, Stock stock);
    Optional<PortfolioItem> findByUserIdAndStockSymbolIgnoreCase(Long userId, String stockSymbol);
}
