package com.bank.poc.gateway.controller;

import com.bank.poc.gateway.dto.TransactionRequest;
import com.bank.poc.gateway.dto.TransactionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@CrossOrigin(origins = "http://localhost:5173", "https://banking-system-using-react-and-spri.vercel.app")
public class TransactionController {

    private final RestTemplate restTemplate;

    @Value("${system2.url}")
    private String system2Url;

    public TransactionController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/transaction")
    public ResponseEntity<TransactionResponse> transaction(@RequestBody TransactionRequest request) {
        if (request.getCardNumber() == null || request.getCardNumber().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new TransactionResponse(false, "Card number required", 0, null));
        }
        if (request.getPin() == null || request.getPin().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new TransactionResponse(false, "PIN required", 0, null));
        }
        if (request.getAmount() <= 0) {
            return ResponseEntity.badRequest()
                    .body(new TransactionResponse(false, "Amount must be positive", 0, null));
        }
        if (request.getType() == null ||
                (!request.getType().equalsIgnoreCase("withdraw")
                        && !request.getType().equalsIgnoreCase("topup"))) {
            return ResponseEntity.badRequest()
                    .body(new TransactionResponse(false, "Type must be 'withdraw' or 'topup'", 0, null));
        }
        if (!request.getCardNumber().startsWith("4")) {
            return ResponseEntity.ok(
                    new TransactionResponse(false, "Card range not supported", 0, null)
            );
        }
        TransactionResponse response =
                restTemplate.postForObject(system2Url + "/process", request, TransactionResponse.class);
        return ResponseEntity.ok(response);
    }
}
