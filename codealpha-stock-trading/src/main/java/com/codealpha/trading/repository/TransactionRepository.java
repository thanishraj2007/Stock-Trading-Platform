package com.codealpha.trading.repository;

import com.codealpha.trading.model.Transaction;
import com.codealpha.trading.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Transaction> findByUserIdAndTransactionTypeOrderByCreatedAtDesc(Long userId, TransactionType transactionType);
}
