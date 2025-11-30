package com.bank.poc.core.controller;

import com.bank.poc.core.dto.CardInfoResponse;
import com.bank.poc.core.dto.TransactionRequest;
import com.bank.poc.core.dto.TransactionResponse;
import com.bank.poc.core.entity.Card;
import com.bank.poc.core.entity.Transaction;
import com.bank.poc.core.service.CardService;
import com.bank.poc.core.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", "https://banking-system-using-react-and-spri.vercel.app")
public class ProcessingController {

    private final TransactionService transactionService;
    private final CardService cardService;

    public ProcessingController(TransactionService transactionService, CardService cardService) {
        this.transactionService = transactionService;
        this.cardService = cardService;
    }

    @PostMapping("/process")
    public ResponseEntity<TransactionResponse> process(@RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.process(request));
    }

    @GetMapping("/card/{cardNumber}")
    public ResponseEntity<CardInfoResponse> card(@PathVariable String cardNumber) {
        return cardService.findCard(cardNumber)
                .map(c -> ResponseEntity.ok(
                        new CardInfoResponse(c.getCardNumber(), c.getBalance(), c.getCustomerName())
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/transactions/all")
    public List<Transaction> all() {
        return transactionService.getAll();
    }

    @GetMapping("/transactions/card/{cardNumber}")
    public List<Transaction> byCard(@PathVariable String cardNumber) {
        return transactionService.getByCard(cardNumber);
    }
}
