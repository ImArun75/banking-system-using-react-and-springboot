package com.bank.poc.core.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Card {
    @Id
    private String cardNumber;
    private String pinHash;
    private double balance;
    private String customerName;
}
