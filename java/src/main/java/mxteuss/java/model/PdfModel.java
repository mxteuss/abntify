package mxteuss.java.model;

import lombok.Data;
import java.util.UUID;

@Data
public class PdfModel {


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
