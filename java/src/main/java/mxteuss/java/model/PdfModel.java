package mxteuss.java.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
public class PdfModel {

    @Id
    @GeneratedValue(strategy =  GenerationType.UUID)
    private UUID id;
    private String curso;
    private String titulo;
    private String nome;
    private String instituicao;
    private String ano;
    private String cidade;
    private String orientador;
    private String errata;
    private String dedicatoria;
    private String agradecimentos;
    private String epigrafe;
    private String resumo;
    private String palavrasChave;
    private String resumoEn;
    private String keywords;
    private String tipoTrabalho;
    private String objetivo;
}
