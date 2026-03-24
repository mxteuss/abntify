package mxteuss.java.DTO;

import java.util.List;

public record GroqResponse(
        String id,
        String object,
        List<Choice> choices
){
    public record Choice(
            int index,
            Message message
        ){}

    public record Message (
            String role,
            String content) {}
    }

