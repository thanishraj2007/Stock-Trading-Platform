package com.codealpha.trading.service;

import com.codealpha.trading.exception.StockNotFoundException;
import com.codealpha.trading.model.Stock;
import com.codealpha.trading.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class StockService {

    private final StockRepository stockRepository;
    private final Random random = new Random();

    @Autowired
    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Transactional(readOnly = true)
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Stock getStockBySymbol(String symbol) {
        return stockRepository.findBySymbolIgnoreCase(symbol)
                .orElseThrow(() -> new StockNotFoundException("Stock with symbol '" + symbol + "' not found."));
    }

    public Stock saveStock(Stock stock) {
        return stockRepository.save(stock);
    }

    /**
     * Simulates market price fluctuation for demo purposes.
     * Generates a realistic random price change between -2.0% and +2.5%.
     */
    public Stock simulatePriceTick(String symbol) {
        Stock stock = getStockBySymbol(symbol);
        double percentChange = (random.nextDouble() * 4.5) - 2.0; // -2.0% to +2.5%
        BigDecimal oldPrice = stock.getCurrentPrice();
        BigDecimal delta = oldPrice.multiply(BigDecimal.valueOf(percentChange / 100.0)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal newPrice = oldPrice.add(delta).setScale(2, RoundingMode.HALF_UP);

        // Ensure price never drops below 1.00
        if (newPrice.compareTo(BigDecimal.ONE) < 0) {
            newPrice = BigDecimal.ONE;
        }

        stock.setCurrentPrice(newPrice);
        stock.setDailyPriceChange(delta);
        stock.setDailyChangePercentage(BigDecimal.valueOf(percentChange).setScale(2, RoundingMode.HALF_UP));

        return stockRepository.save(stock);
    }

    /**
     * Batch simulates price ticks across all active stocks.
     */
    public List<Stock> simulateMarketTick() {
        List<Stock> stocks = stockRepository.findAll();
        for (Stock stock : stocks) {
            double percentChange = (random.nextDouble() * 3.5) - 1.7; // -1.7% to +1.8%
            BigDecimal delta = stock.getCurrentPrice().multiply(BigDecimal.valueOf(percentChange / 100.0)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal newPrice = stock.getCurrentPrice().add(delta).setScale(2, RoundingMode.HALF_UP);
            if (newPrice.compareTo(BigDecimal.ONE) < 0) newPrice = BigDecimal.ONE;
            stock.setCurrentPrice(newPrice);
            stock.setDailyPriceChange(delta);
            stock.setDailyChangePercentage(BigDecimal.valueOf(percentChange).setScale(2, RoundingMode.HALF_UP));
            stockRepository.save(stock);
        }
        return stockRepository.findAll();
    }
}
