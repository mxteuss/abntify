package mxteuss.java.service;

import lombok.Data;
import mxteuss.java.DTO.GroqResponse;
import mxteuss.java.model.PdfModel;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Data
public class AiService {

    @Value("${spring.ai.grok.api-key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();
    private GroqResponse groqResponse;

    public void traduzirResumo(PdfModel dados) {

        SystemMessage systemPrompt = new SystemMessage("""
        You are an expert academic translator.

        Guidelines:
        - Preserve the original meaning exactly.
        - Maintain formal academic tone and style.
        - Use domain-appropriate terminology.
        - Do not omit or add information.
        - Keep abbreviations, proper nouns, and citations unchanged.
        - Ensure grammatical correctness and natural fluency.
        - Use American English spelling and conventions.
        - Do not translate technical terms that are commonly used in English.
        - If a term has multiple translations, choose the most widely accepted in academic literature.
        - Do not include explanations or comments.
        - Return only the translated text.
        """);


        String prompt = """
        Translate the following academic abstract and keywords into English.

        Return ONLY a valid JSON in this format:
        {"resumoEn": "...", "keywords": "..."}

        Instructions:
        - Translate BOTH the abstract and the keywords.
        - Keep keywords concise and separated by commas.
        - Do not include explanations.

        ABSTRACT:
        %s

        KEYWORDS:
        %s
        """.formatted(dados.getResumo(), dados.getPalavrasChave());

        UserMessage userMessage = new UserMessage(prompt);

        assert userMessage.getText() != null;
        assert systemPrompt.getText() != null;

        Map<String, Object> body = Map.of(
                "model", "llama-3.3-70b-versatile",

                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt.getText()),
                        Map.of("role", "user", "content", userMessage.getText())));

        GroqResponse response = restClient.post()
                .uri("https://api.groq.com/openai/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(GroqResponse.class);

        ObjectMapper mapper = new ObjectMapper();

        Objects.requireNonNull(response, "Resposta da API veio nula");
        String content = response.choices().getFirst().message().content();
        Map<String, String> result = mapper.readValue(content, Map.class);

        dados.setResumoEn(result.get("resumoEn"));
        dados.setKeywords(result.get("keywords"));
    }
}
