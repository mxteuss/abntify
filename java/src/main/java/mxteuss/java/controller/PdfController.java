package mxteuss.java.controller;

import mxteuss.java.model.PdfModel;
import mxteuss.java.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class PdfController {

    public PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }


    @PostMapping("/gerar-pdf")
    public ResponseEntity<byte[]> fazerPdf(@RequestBody PdfModel dados) {
        try {
            byte[] pdf = pdfService.gerarPdfABNT(dados);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "abnt.pdf");

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/historico")
    public List<Map<String, Object>>  listarPdf(){
        return pdfService.listPDF().stream().map(historico -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", historico.getId());
            item.put("nome", historico.getNomeArquivo());
            item.put("descricao", historico.getDescricao());
            item.put("geradoEm", historico.getGeradoEm());

            return item;
        }).toList();
        }
    }

