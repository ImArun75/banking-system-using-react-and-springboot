package com.bank.poc.core.service;

import com.bank.poc.core.dto.TransactionRequest;
import com.bank.poc.core.dto.TransactionResponse;
import com.bank.poc.core.entity.Card;
import com.bank.poc.core.entity.Transaction;
import com.bank.poc.core.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CardService cardService;

    public TransactionService(TransactionRepository transactionRepository, CardService cardService) {
        this.transactionRepository = transactionRepository;
        this.cardService = cardService;
    }

    @Transactional
    public TransactionResponse process(TransactionRequest request) {
        Optional<Card> cardOpt = cardService.findCard(request.getCardNumber());
        if (cardOpt.isEmpty()) {
            return new TransactionResponse(false, "Invalid card number", 0, null);
        }
        Card card = cardOpt.get();
        if (!cardService.verifyPin(request.getPin(), card.getPinHash())) {
            logFailed(request.getCardNumber(), request.getType(), request.getAmount(), "Invalid PIN");
            return new TransactionResponse(false, "Invalid PIN", card.getBalance(), null);
        }
        if (request.getAmount() <= 0) {
            return new TransactionResponse(false, "Invalid amount", card.getBalance(), null);
        }
        if ("withdraw".equalsIgnoreCase(request.getType())) {
            return handleWithdraw(card, request);
        }
        if ("topup".equalsIgnoreCase(request.getType())) {
            return handleTopup(card, request);
        }
        return new TransactionResponse(false, "Invalid transaction type", card.getBalance(), null);
    }

    private TransactionResponse handleWithdraw(Card card, TransactionRequest request) {
        if (card.getBalance() < request.getAmount()) {
            logFailed(request.getCardNumber(), "withdraw", request.getAmount(), "Insufficient balance");
            return new TransactionResponse(false, "Insufficient balance", card.getBalance(), null);
        }
        card.setBalance(card.getBalance() - request.getAmount());
        cardService.saveCard(card);
        Transaction t = logSuccess(request.getCardNumber(), "withdraw", request.getAmount());
        return new TransactionResponse(true, "Withdrawal successful", card.getBalance(), t.getId());
    }

    private TransactionResponse handleTopup(Card card, TransactionRequest request) {
        card.setBalance(card.getBalance() + request.getAmount());
        cardService.saveCard(card);
        Transaction t = logSuccess(request.getCardNumber(), "topup", request.getAmount());
        return new TransactionResponse(true, "Top-up successful", card.getBalance(), t.getId());
    }

    private Transaction logSuccess(String cardNumber, String type, double amount) {
        Transaction t = new Transaction();
        t.setCardNumber(cardNumber);
        t.setType(type);
        t.setAmount(amount);
        t.setTimestamp(LocalDateTime.now());
        t.setStatus("SUCCESS");
        t.setReason(null);
        return transactionRepository.save(t);
    }

    private void logFailed(String cardNumber, String type, double amount, String reason) {
        Transaction t = new Transaction();
        t.setCardNumber(cardNumber);
        t.setType(type);
        t.setAmount(amount);
        t.setTimestamp(LocalDateTime.now());
        t.setStatus("FAILED");
        t.setReason(reason);
        transactionRepository.save(t);
    }

    public List<Transaction> getAll() {
        return transactionRepository.findAllByOrderByTimestampDesc();
    }

    public List<Transaction> getByCard(String cardNumber) {
        return transactionRepository.findByCardNumberOrderByTimestampDesc(cardNumber);
    }
}
