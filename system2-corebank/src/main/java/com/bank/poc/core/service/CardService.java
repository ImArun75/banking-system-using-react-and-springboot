package com.bank.poc.core.service;

import com.bank.poc.core.entity.Card;
import com.bank.poc.core.repository.CardRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
public class CardService {

    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public String hashPin(String pin) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(pin.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) {
                    hex.append('0');
                }
                hex.append(h);
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    public boolean verifyPin(String pin, String storedHash) {
        return storedHash.equals(hashPin(pin));
    }

    public Optional<Card> findCard(String cardNumber) {
        return cardRepository.findByCardNumber(cardNumber);
    }

    public Card saveCard(Card card) {
        return cardRepository.save(card);
    }
}
