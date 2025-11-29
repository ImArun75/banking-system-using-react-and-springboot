package com.bank.poc.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private boolean success;
    private String message;
    private double balance;
    private Long transactionId;
}
