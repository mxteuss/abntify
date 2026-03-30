package mxteuss.java.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mxteuss.java.DTO.TraducaoResponse;
import mxteuss.java.model.PdfHistory;
import mxteuss.java.model.PdfModel;
import mxteuss.java.service.AiService;
import mxteuss.java.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@CrossOrigin(origins = "*")
@AllArgsConstructor
@Tag(name="")
public class PdfController {

    public PdfService pdfService;
    public AiService aiService;



    @Operation(summary = "Gerar PDF", description = "Este endpoint recebe os dados do usuário pelo front e retorna o arquivo formatado em abnt com as informações dadas.")
    @ApiResponse(responseCode = "200", description = "Arquivo PDF gerado com sucesso.")
    @ApiResponse(responseCode = "400", description = "Informações não estão completamente preenchidas.")
    @ApiResponse(responseCode = "500", description = "Problema no servidor")
    @PostMapping("/gerar-pdf")
    public ResponseEntity<byte[]> fazerPdf(@RequestBody PdfModel dados,
                                           @RequestHeader ("X-Session-Id") String sessionId) {
        try {
            byte[] pdf = pdfService.gerarPdfABNT(dados, sessionId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "abnt.pdf");

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        }catch (Exception e){
            log.error("Error: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Gerar DOCX", description = "Este endpoint recebe os dados do usuário pelo front e retorna o arquivo formatado em abnt PDF com as informações dadas.")
    @ApiResponse(responseCode = "200", description = "Arquivo DOCX gerado com sucesso.")
    @ApiResponse(responseCode = "400", description = "Informações não estão completamente preenchidas.")
    @ApiResponse(responseCode = "500", description = "Problema no servidor")
    @PostMapping("/gerar-docx")
    public ResponseEntity<byte[]> fazerDoc(@RequestBody PdfModel dados,
                                           @RequestHeader ("X-Session-Id") String sessionId) {
        try {
            byte[] docx = pdfService.gerarDOC(dados, sessionId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
            headers.setContentDispositionFormData("attachment", "abnt.docx");

            return new ResponseEntity<>(docx, headers, HttpStatus.OK);
        } catch (Exception e ){
            log.error("Error: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Histórico", description = "Este endpoint retorna todos os arquivos gerados pelo usuário enquanto ele esteve com a sessão ativa.")
    @ApiResponse(responseCode = "200", description = "Histórico carregado com sucesso.")
    @ApiResponse(responseCode = "500", description = "Problema no servidor")
    @GetMapping("/historico")
    public List<Map<String, Object>> listarPdf(
            @RequestHeader("X-Session-Id") String sessionId){

        System.out.println("Entrou no historico");
        return pdfService.listPDF(sessionId).stream().map(historico -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", historico.getId());
            item.put("nome", historico.getNomeArquivo());
            item.put("geradoEm", historico.getGeradoEm());
            return item;
        }).toList();
        }


    @Operation(summary = "Download", description = "Arquivos que ficaram anexados na interface do histórico")
    @ApiResponse(responseCode = "200", description = "Arquivo carregado com sucesso.")
    @ApiResponse(responseCode = "500", description = "Problema no servidor")
    @GetMapping("/download/{id}")
    public ResponseEntity<byte []> download(@PathVariable UUID id){
        PdfHistory pdfHistory = pdfService.buscarId(id);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + pdfHistory.getNomeArquivo())
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfHistory.getConteudo());

    }


    @Operation(summary = "Traduzir", description = "Realiza a tradução do português para o inglês no resumo e palavaras chave")
    @ApiResponse(responseCode = "200", description = "Arquivo carregado com sucesso.")
    @ApiResponse(responseCode = "500", description = "Problema no servidor")
    @PostMapping("/traduzir")
    public ResponseEntity<TraducaoResponse> traduzir(@RequestBody PdfModel dados){
        aiService.traduzirResumo(dados);

        TraducaoResponse response = new TraducaoResponse();
        response.setResumoEn(dados.getResumoEn());
        response.setKeywords(dados.getKeywords());

        return ResponseEntity.ok(response);
    }

    }


