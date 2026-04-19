package mxteuss.java.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mxteuss.java.DTO.TraducaoResponse;
import mxteuss.java.model.ArchiveHistory;
import mxteuss.java.model.ArchiveModel;
import mxteuss.java.service.AiService;
import mxteuss.java.service.ArchiveService;
import mxteuss.java.service.RateLimiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
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
public class ArchiveController {

    public ArchiveService archiveService;
    public AiService aiService;
    @Autowired
    public RateLimiterService rateLimiterService;


    @Operation(summary = "Gerar PDF", description = "Este endpoint recebe os dados do usuário pelo front e retorna o arquivo formatado em abnt com as informações dadas.")
    @ApiResponse(responseCode = "200", description = "Arquivo PDF gerado com sucesso.")
    @ApiResponse(responseCode = "400", description = "Informações não estão completamente preenchidas.")
    @ApiResponse(responseCode = "500", description = "Problema no servidor")
    @PostMapping("/gerar-pdf")
    public ResponseEntity<byte[]> fazerPdf(@RequestBody ArchiveModel dados,
                                           @RequestHeader ("X-Session-Id") String sessionId) {
        try {
            byte[] archive = archiveService.gerarPdfABNT(dados, sessionId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "abnt.pdf");

            return new ResponseEntity<>(archive, headers, HttpStatus.OK);
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
    public ResponseEntity<byte[]> fazerDoc(@RequestBody ArchiveModel dados,
                                           @RequestHeader ("X-Session-Id") String sessionId) {
        try {
            byte[] docx = archiveService.gerarDOC(dados, sessionId);

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
    @ApiResponse(responseCode = "500", description = "Problema no servidor.")
    @GetMapping("/historico")
    public List<Map<String, Object>> listarPdf(
            @RequestHeader("X-Session-Id") String sessionId){

        rateLimiterService.checkOrThrow("relaxed");
        return archiveService.listPDF(sessionId).stream().map(historico -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", historico.getId());
            item.put("nome", historico.getNomeArquivo());
            item.put("geradoEm", historico.getGeradoEm());
            return item;

        }).toList();
        }


    @Operation(summary = "Download", description = "Arquivos que ficaram anexados na interface do histórico")
    @ApiResponse(responseCode = "200", description = "Arquivo carregado com sucesso.")
    @ApiResponse(responseCode = "500", description = "Problema no servidor.")
    @GetMapping("/download/{id}")
    public ResponseEntity<byte []> download(@PathVariable UUID id){
        ArchiveHistory archiveHistory = archiveService.buscarId(id);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + archiveHistory.getNomeArquivo())
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(archiveHistory.getConteudo());

    }


    @Operation(summary = "Traduzir", description = "Realiza a tradução do português para o inglês no resumo e palavaras chave")
    @ApiResponse(responseCode = "200", description = "Arquivo carregado com sucesso.")
    @ApiResponse(responseCode = "500", description = "Problema no servidor.")
    @PostMapping("/traduzir")
    public ResponseEntity<TraducaoResponse> traduzir(@RequestBody ArchiveModel dados){
        aiService.traduzirResumo(dados);

        TraducaoResponse response = new TraducaoResponse();
        response.setResumoEn(dados.getResumoEn());
        response.setKeywords(dados.getKeywords());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Previsualizar", description = "Manda o arquivo para o frontend para a pré-visualização, sem necessidade de todos os input estarem preenchidos.")
    @ApiResponse(responseCode = "200", description = "Arquivo pré-carregado com sucesso.")
    @ApiResponse(responseCode = "500", description = "Problema no servidor.")
    @PostMapping("/preview")
    public ResponseEntity<byte[]> previsualizar(@RequestBody ArchiveModel dados,
                                                @RequestHeader ("X-Session-Id") String sessionId) {
        try {
            byte[] archive = archiveService.gerarPdfABNT(dados, sessionId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline().build());

            return new ResponseEntity<>(archive, headers, HttpStatus.OK);
        }catch (Exception e){
            log.error("Error: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    }


