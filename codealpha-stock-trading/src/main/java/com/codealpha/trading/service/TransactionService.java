package com.codealpha.trading.service;

import com.codealpha.trading.model.Transaction;
import com.codealpha.trading.model.TransactionType;
import com.codealpha.trading.model.User;
import com.codealpha.trading.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction recordTransaction(User user, String symbol, String companyName,
                                         TransactionType type, int quantity,
                                         BigDecimal executionPrice, BigDecimal totalAmount) {
        Transaction tx = new Transaction(user, symbol, companyName, type, quantity, executionPrice, totalAmount);
        return transactionRepository.save(tx);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getUserTransactionsByType(Long userId, TransactionType type) {
        return transactionRepository.findByUserIdAndTransactionTypeOrderByCreatedAtDesc(userId, type);
    }
}
