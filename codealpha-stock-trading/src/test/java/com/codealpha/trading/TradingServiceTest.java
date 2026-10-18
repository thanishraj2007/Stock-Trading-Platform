package com.codealpha.trading;

import com.codealpha.trading.dto.TradeRequest;
import com.codealpha.trading.dto.TradeResponse;
import com.codealpha.trading.exception.InsufficientBalanceException;
import com.codealpha.trading.exception.InsufficientStockException;
import com.codealpha.trading.model.PortfolioItem;
import com.codealpha.trading.model.Stock;
import com.codealpha.trading.model.Transaction;
import com.codealpha.trading.model.TransactionType;
import com.codealpha.trading.model.User;
import com.codealpha.trading.repository.StockRepository;
import com.codealpha.trading.repository.UserRepository;
import com.codealpha.trading.service.PortfolioService;
import com.codealpha.trading.service.TradingService;
import com.codealpha.trading.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TradingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StockRepository stockRepository;

    @Mock
    private PortfolioService portfolioService;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TradingService tradingService;

    private User sampleUser;
    private Stock sampleStock;

    @BeforeEach
    void setUp() {
        sampleUser = new User("codealpha_trader", "CodeAlpha Intern", "trader@codealpha.edu", new BigDecimal("100000.00"));
        sampleUser.setId(1L);

        sampleStock = new Stock("TCS", "Tata Consultancy Services", new BigDecimal("3900.00"),
                new BigDecimal("50.00"), new BigDecimal("1.25"), "INR", "IT");
        sampleStock.setId(1L);
    }

    @Test
    @DisplayName("Should successfully buy stock when balance is sufficient")
    void testBuyStock_Success() {
        // Arrange
        TradeRequest request = new TradeRequest(1L, "TCS", 10); // 10 * 3900 = 39,000 INR
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(stockRepository.findBySymbolIgnoreCase("TCS")).thenReturn(Optional.of(sampleStock));
        when(transactionService.recordTransaction(any(), any(), any(), any(), anyInt(), any(), any()))
                .thenReturn(new Transaction(sampleUser, "TCS", "Tata Consultancy Services", TransactionType.BUY, 10, new BigDecimal("3900.00"), new BigDecimal("39000.00")));

        // Act
        TradeResponse response = tradingService.buyStock(request);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("TCS", response.getSymbol());
        assertEquals(10, response.getQuantity());
        assertEquals(new BigDecimal("39000.00"), response.getTotalAmount());
        assertEquals(new BigDecimal("61000.00"), sampleUser.getVirtualCashBalance()); // 100,000 - 39,000

        verify(userRepository, times(1)).save(sampleUser);
        verify(portfolioService, times(1)).updatePortfolioOnBuy(sampleUser, sampleStock, 10, new BigDecimal("3900.00"));
    }

    @Test
    @DisplayName("Should throw InsufficientBalanceException when buying exceeds available virtual cash")
    void testBuyStock_InsufficientFunds() {
        // Arrange: User has 10,000 but trade costs 39,000
        sampleUser.setVirtualCashBalance(new BigDecimal("10000.00"));
        TradeRequest request = new TradeRequest(1L, "TCS", 10);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(stockRepository.findBySymbolIgnoreCase("TCS")).thenReturn(Optional.of(sampleStock));

        // Act & Assert
        assertThrows(InsufficientBalanceException.class, () -> tradingService.buyStock(request));
        verify(userRepository, never()).save(any());
        verify(transactionService, never()).recordTransaction(any(), any(), any(), any(), anyInt(), any(), any());
    }

    @Test
    @DisplayName("Should successfully sell owned stock and credit proceeds")
    void testSellStock_Success() {
        // Arrange
        TradeRequest request = new TradeRequest(1L, "TCS", 5); // 5 * 3900 = 19,500 INR
        PortfolioItem holding = new PortfolioItem(sampleUser, sampleStock, 10, new BigDecimal("3800.00"));

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(stockRepository.findBySymbolIgnoreCase("TCS")).thenReturn(Optional.of(sampleStock));
        when(portfolioService.getHolding(1L, "TCS")).thenReturn(Optional.of(holding));
        when(transactionService.recordTransaction(any(), any(), any(), any(), anyInt(), any(), any()))
                .thenReturn(new Transaction(sampleUser, "TCS", "Tata Consultancy Services", TransactionType.SELL, 5, new BigDecimal("3900.00"), new BigDecimal("19500.00")));

        // Act
        TradeResponse response = tradingService.sellStock(request);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals(TransactionType.SELL, response.getTransactionType());
        assertEquals(new BigDecimal("119500.00"), sampleUser.getVirtualCashBalance()); // 100,000 + 19,500
        verify(portfolioService, times(1)).updatePortfolioOnSell(sampleUser, sampleStock, 5);
        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    @DisplayName("Should throw InsufficientStockException when selling more shares than owned")
    void testSellStock_InsufficientShares() {
        // Arrange: User owns 3 shares, tries to sell 10
        TradeRequest request = new TradeRequest(1L, "TCS", 10);
        PortfolioItem holding = new PortfolioItem(sampleUser, sampleStock, 3, new BigDecimal("3800.00"));

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(stockRepository.findBySymbolIgnoreCase("TCS")).thenReturn(Optional.of(sampleStock));
        when(portfolioService.getHolding(1L, "TCS")).thenReturn(Optional.of(holding));

        // Act & Assert
        assertThrows(InsufficientStockException.class, () -> tradingService.sellStock(request));
        verify(portfolioService, never()).updatePortfolioOnSell(any(), any(), anyInt());
    }
}
