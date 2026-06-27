package mxteuss.java.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;
import java.util.UUID;

@Data
@Entity
public class ArchiveModel {

    @Id
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private UUID id;
    private String curso;
    private String titulo;
    private String nome;
    private String instituicao;
    private String ano;
    private String cidade;
    private String orientador;
    private String dedicatoria;
    private String agradecimentos;
    private String epigrafe;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String resumo;
    private String palavrasChave;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String resumoEn;
    private String keywords;
    private String tipoTrabalho;
    private String objetivo;
}

