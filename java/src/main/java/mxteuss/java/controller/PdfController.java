package mxteuss.java.controller;

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
public class PdfController {

    public PdfService pdfService;
    public AiService aiService;



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


    @GetMapping("/download/{id}")
    public ResponseEntity<byte []> download(@PathVariable UUID id){
        System.out.println("Entrou no controller");
        PdfHistory pdfHistory = pdfService.buscarId(id);



            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + pdfHistory.getNomeArquivo())
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfHistory.getConteudo());

    }

    @PostMapping("/traduzir")
    public ResponseEntity<TraducaoResponse> traduzir(@RequestBody PdfModel dados){
        aiService.traduzirResumo(dados);

        TraducaoResponse response = new TraducaoResponse();
        response.setResumoEn(dados.getResumoEn());
        response.setKeywords(dados.getKeywords());

        return ResponseEntity.ok(response);
    }
    }


