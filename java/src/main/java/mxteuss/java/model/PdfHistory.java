package mxteuss.java.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
public class PdfHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String sessionId;
    private String nomeArquivo;
    private LocalDateTime geradoEm;

    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] conteudo;

}
