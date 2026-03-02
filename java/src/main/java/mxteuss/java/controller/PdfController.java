package mxteuss.java.controller;

import mxteuss.java.model.PdfModel;
import mxteuss.java.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class PdfController {

    public PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping("/gerar-pdf")
    public ResponseEntity<byte[]> getPdf(@RequestBody PdfModel dados) {
        byte[] pdf = pdfService.gerarPdfABNT(dados);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "abnt.pdf");
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}
