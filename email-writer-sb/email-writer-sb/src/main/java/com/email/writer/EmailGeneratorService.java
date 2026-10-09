package com.email.writer;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import org.springframework.http.MediaType;
import java.util.Map;


@Service
public class EmailGeneratorService {
    private final WebClient webClient = WebClient.builder().build();

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String generateEmailReply(EmailRequest emailRequest){
    // build prompt
        String prompt = buildPrompt(emailRequest);


        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );


        System.out.println("Request Body = " + requestBody);

        ObjectMapper mapper = new ObjectMapper();

        try {
            System.out.println(
                    "Request Body = " + mapper.writeValueAsString(requestBody)
            );
        } catch (Exception e) {
            e.printStackTrace();
        }


        String response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

    //   extract response
    return extractResponseContent(response);

    }

    private String extractResponseContent(String response) {
        try{
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(response);
        return rootNode.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
    }catch (Exception e) {
        return "Error processing request: " + e.getMessage();
    }


    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email:, without subject ");
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("use a ").append(emailRequest.getTone()).append(" tone .");
            // use a professional/ casual tone
        }
        prompt.append("Original Email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }

}

