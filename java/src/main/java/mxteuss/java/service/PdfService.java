package mxteuss.java.service;


import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import mxteuss.java.model.PdfHistory;
import mxteuss.java.model.PdfModel;
import mxteuss.java.repository.PdfHistoryRepository;
import mxteuss.java.repository.PdfModelRepository;
import org.apache.poi.xwpf.usermodel.*;
import org.openpdf.text.*;

import org.openpdf.text.Document;
import org.openpdf.text.pdf.ColumnText;
import org.openpdf.text.pdf.PdfContentByte;
import org.openpdf.text.pdf.PdfWriter;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTPageMar;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTSectPr;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.openpdf.text.pdf.BaseFont;
import org.springframework.web.filter.RequestContextFilter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Data
@Service

public class PdfService {

    private final ResourceLoader resourceLoader;
    private final RequestContextFilter requestContextFilter;
    private PdfHistoryRepository historyRepository;
    private PdfModelRepository modelRepository;

    public PdfService(ResourceLoader resourceLoader, RequestContextFilter requestContextFilter, PdfHistoryRepository historyRepository, PdfModelRepository modelRepository) {
        this.resourceLoader = resourceLoader;
        this.requestContextFilter = requestContextFilter;
        this.historyRepository = historyRepository;
        this.modelRepository = modelRepository;
    }

    String regexLetras = "[^\\p{L} ]";
    String regexPontuacao = "[^\\p{L}.,!?;: ]";


    public byte[] gerarPdfABNT(PdfModel pdfModel, String sessionId) {
        PdfHistory pdfHistory = new PdfHistory();

        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();


        try {
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);
            document.setMargins(
                    72f,
                    50f,
                    85.05f,
                    50f
            );
            document.open();

            Resource resNormal = resourceLoader.getResource("classpath:fonts/arial.ttf"); //  Localiza o arquivo
            byte[] bytesNormal = resNormal.getInputStream().readAllBytes(); // Traduz o arquivo ttf para um array de bytes

            Resource resItalic = resourceLoader.getResource("classpath:fonts/ariali.ttf");
            byte[] bystesItalic = resItalic.getInputStream().readAllBytes();

            Resource resBold = resourceLoader.getResource("classpath:fonts/arialbd.ttf");
            byte[] bytesBold = resBold.getInputStream().readAllBytes();

            BaseFont bfNormal = BaseFont.createFont("arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, true, bytesNormal, null);
            BaseFont bfItalic = BaseFont.createFont("ariali.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, true, bystesItalic, null);
            BaseFont bfBold = BaseFont.createFont("arialbd.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED, true, bytesBold, null);

            Font fontNormal = new Font(bfNormal, 12, Font.NORMAL);
            Font fontItalic = new Font(bfItalic, 12, Font.ITALIC);
            Font fontBold = new Font(bfBold, 14, Font.BOLD);

            // ---------------------------------// CAPA ------------------------------------------------------------

            Paragraph instituicao = new Paragraph(pdfModel.getInstituicao().toUpperCase().replaceAll(regexLetras, ""), fontBold);
            instituicao.setAlignment(Paragraph.ALIGN_CENTER);
            instituicao.setSpacingBefore(50f);
            document.add(instituicao);

            Paragraph curso = new Paragraph(pdfModel.getCurso().toUpperCase().replaceAll(regexLetras, ""), fontNormal);
            curso.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(curso);

            Paragraph nome = new Paragraph(pdfModel.getNome().toUpperCase().replaceAll(regexLetras, ""), fontBold);
            nome.setAlignment(Paragraph.ALIGN_CENTER);
            nome.setSpacingBefore(100f);
            document.add(nome);

            Paragraph titulo = new Paragraph(pdfModel.getTitulo().replaceAll(regexLetras, ""), fontBold);
            titulo.setAlignment(Paragraph.ALIGN_CENTER);
            titulo.setSpacingBefore(180f);
            document.add(titulo);

            PdfContentByte canvas = writer.getDirectContent();

            canvas.setFontAndSize(BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED), 12);
            float Centro = PageSize.A4.getWidth() / 2;

            canvas.showTextAligned(PdfContentByte.ALIGN_CENTER,
                    pdfModel.getCidade().replaceAll(regexLetras, ""),
                    Centro, 100f, 0);


            canvas.showTextAligned(PdfContentByte.ALIGN_CENTER,
                    pdfModel.getAno(),
                    Centro, 85f, 0);

// ---------------------------------// FOLHA DE ROSTO ------------------------------------------------------------
            document.newPage();

            document.add(nome);
            document.add(titulo);

            ColumnText ct = new ColumnText(canvas);

            ct.setSimpleColumn(226.8f,
                    200f,
                    PageSize.A4.getWidth() - 85.05f,
                    400f);
            ct.setAlignment(Element.ALIGN_RIGHT);


            Paragraph paragraph = new Paragraph(String.format("%s para obtenção do título de %s em %s apresentado à %s ",
                    Objects.equals(pdfModel.getTipoTrabalho(), "TCC") ? "Trabalho de Conclusão de Curso" : pdfModel.getTipoTrabalho().replaceAll(regexLetras, ""),
                    pdfModel.getObjetivo().replaceAll(regexLetras, ""),
                    pdfModel.getCurso().replace(regexLetras, ""),
                    pdfModel.getInstituicao().replaceAll(regexLetras, "")), fontNormal);
            paragraph.setAlignment(Paragraph.ALIGN_RIGHT);
            paragraph.setSpacingBefore(80f);
            ct.addElement(paragraph);

            Paragraph orientador = new Paragraph("Orientador(a): " + pdfModel.getOrientador().replace(regexLetras, ""), fontNormal);
            orientador.setAlignment(Paragraph.ALIGN_RIGHT);
            orientador.setSpacingBefore(40f);
            ct.addElement(orientador);

            try {
                ct.go();
            } catch (Exception e) {
                System.out.println("Error:" + e.getMessage());
            }

            canvas.setFontAndSize(BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED), 12);
            canvas.showTextAligned(PdfContentByte.ALIGN_CENTER,
                    pdfModel.getCidade().replaceAll(regexLetras, ""),
                    Centro, 100f, 0);

            canvas.showTextAligned(PdfContentByte.ALIGN_CENTER,
                    pdfModel.getAno(),
                    Centro, 85f, 0);


            // ---------------------------------// DEDICATÓRIA ------------------------------------------------------------
            document.newPage();

            ColumnText ct1 = new ColumnText(canvas);

            ct1.setSimpleColumn(226.8f,
                    190f,
                    PageSize.A4.getWidth() - 85.05f,
                    56.7f);
            ct1.setAlignment(Element.ALIGN_RIGHT);

            Paragraph dedicatoria = new Paragraph(pdfModel.getDedicatoria().replaceAll(regexPontuacao, ""), fontNormal);
            dedicatoria.setAlignment(Paragraph.ALIGN_RIGHT);
            ct1.addElement(dedicatoria);

            try {
                ct1.go();
            } catch (DocumentException e) {
                System.out.println("Error:" + e.getMessage());
            }

            // ---------------------------------// AGRADECIMENTOS ------------------------------------------------------------
            document.newPage();

            Paragraph titulo3 = new Paragraph("AGRADECIMENTOS", fontBold);
            titulo3.setAlignment(Paragraph.ALIGN_CENTER);

            Paragraph agradecimentos = new Paragraph(pdfModel.getAgradecimentos().replaceAll(regexPontuacao, ""), fontNormal);
            agradecimentos.setAlignment(Paragraph.ALIGN_CENTER);
            agradecimentos.setSpacingBefore(50f);
            document.add(titulo3);
            document.add(agradecimentos);

            // ---------------------------------// Epígrafe ------------------------------------------------------------
            document.newPage();

            Paragraph epigrafe = new Paragraph(pdfModel.getEpigrafe().replaceAll(regexPontuacao, ""), fontItalic);
            epigrafe.setAlignment(Paragraph.ALIGN_RIGHT);
            ct1.addElement(epigrafe);

            try {
                ct1.go();
            } catch (DocumentException e) {
                System.out.println("Error:" + e.getMessage());
            }

            // ---------------------------------// RESUMO ------------------------------------------------------------
            document.newPage();

            Paragraph titulo4 = new Paragraph("RESUMO", fontBold);
            titulo4.setAlignment(Paragraph.ALIGN_CENTER);

            Paragraph resumo = new Paragraph(pdfModel.getResumo(), fontNormal);
            resumo.setAlignment(Paragraph.ALIGN_CENTER);
            resumo.setSpacingBefore(50f);

            Paragraph palavrasChave = new Paragraph();
            palavrasChave.add(new Chunk("Palavras-chave:  ", FontFactory.getFont(FontFactory.TIMES_ROMAN, 12, Font.BOLD)));
            palavrasChave.add(new Chunk(pdfModel.getPalavrasChave().replaceAll(regexPontuacao, "")));
            palavrasChave.setAlignment(Paragraph.ALIGN_CENTER);
            palavrasChave.setSpacingBefore(58.05f);


            document.add(titulo4);
            document.add(resumo);
            document.add(palavrasChave);


            // ---------------------------------// ABSTRACT ------------------------------------------------------------
            document.newPage();

            Paragraph titulo5 = new Paragraph("ABSTRACT", fontBold);
            titulo5.setAlignment(Paragraph.ALIGN_CENTER);

            Paragraph resumoEn = new Paragraph(pdfModel.getResumoEn(), fontNormal);
            resumoEn.setAlignment(Paragraph.ALIGN_CENTER);
            resumoEn.setSpacingBefore(50f);

            Paragraph keywords = new Paragraph();
            keywords.add(new Chunk("Keywords:  ", FontFactory.getFont(FontFactory.TIMES_ROMAN, 12, Font.BOLD)));
            keywords.add(new Chunk(pdfModel.getKeywords().replaceAll(regexPontuacao, "")));
            keywords.setAlignment(Paragraph.ALIGN_CENTER);
            keywords.setSpacingBefore(58.05f);
            document.add(titulo5);
            document.add(resumoEn);
            document.add(keywords);
            document.close();

            byte[] pdf = outputStream.toByteArray();
            pdfHistory.setNomeArquivo(pdfModel.getNome());
            pdfHistory.setSessionId(sessionId);
            pdfHistory.setGeradoEm(LocalDateTime.now());
            pdfHistory.setConteudo(pdf);
            historyRepository.save(pdfHistory);

            return pdf;

        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] gerarDOC(PdfModel pdfModel, String sessionId){



        try {
            XWPFDocument doc = new XWPFDocument();

            CTSectPr sectPr = doc.getDocument().getBody().addNewSectPr();
            CTPageMar pageMar = sectPr.addNewPgMar();
            pageMar.setTop(BigInteger.valueOf(1701L)); // 3cm
            pageMar.setLeft(BigInteger.valueOf(1701L));
            pageMar.setBottom(BigInteger.valueOf(1134L)); // 2cm
            pageMar.setRight(BigInteger.valueOf(1134L));


            // ---------------------------------// CAPA ------------------------------------------------------------


            createCenteredParagraph(doc, pdfModel.getInstituicao().toUpperCase().replaceAll(regexLetras, ""), 14, true, false, 0);
            createCenteredParagraph(doc, pdfModel.getCurso().replaceAll(regexLetras, ""), 14, false, false, 0);
            createCenteredParagraph(doc, pdfModel.getNome().replaceAll(regexLetras, ""), 14, true, false, 2000);
            createCenteredParagraph(doc, pdfModel.getTitulo().replaceAll(regexLetras, ""), 14, true, false, 3600);
            createCenteredParagraph(doc, pdfModel.getCidade().replaceAll(regexLetras, ""), 12, false, false, 4900);
            createCenteredParagraph(doc, pdfModel.getAno(), 12, false, false, 0);

            // Espaçamento
            XWPFParagraph pageBreak = doc.createParagraph();
            XWPFRun run = pageBreak.createRun();
            run.addBreak(BreakType.PAGE);


            // ---------------------------------// FOLHA DE ROSTO ------------------------------------------------------

            createCenteredParagraph(doc, pdfModel.getNome().replaceAll(regexPontuacao, ""),  14, true, false, 900);
            createCenteredParagraph(doc, pdfModel.getTitulo().replaceAll(regexPontuacao, ""),  14, true, false, 2500);
            createRightParagraph(doc, String.format("%s para obtenção do título de %s em %s apresentado à %s",
                            Objects.equals(pdfModel.getTipoTrabalho(), "TCC") ? "Trabalho de Conclusão de Curso" : pdfModel.getTipoTrabalho().replaceAll(regexPontuacao, ""),
                            pdfModel.getObjetivo().replaceAll(regexPontuacao, ""),
                            pdfModel.getCurso().replaceAll(regexPontuacao, ""),
                            pdfModel.getInstituicao().replaceAll(regexPontuacao, "")),
                    12, false, false, 2900);
            createRightParagraph(doc,"Orientador(a): " + pdfModel.getOrientador().replaceAll(regexPontuacao, ""), 12, false, false, 1000);
            createCenteredParagraph(doc, pdfModel.getCidade().replaceAll(regexLetras, ""),  12, false, false, 4000);
            createCenteredParagraph(doc, pdfModel.getAno(), 12, false, false, 0);

            // Espaçamento

            XWPFParagraph pageBreak2 = doc.createParagraph();
            pageBreak2.createRun().addBreak(BreakType.PAGE);

            // ---------------------------------// Dedicatória ------------------------------------------------------

            createCenteredParagraph(doc, "", 12, false, false, 1900);
            createRightParagraph(doc, pdfModel.getDedicatoria().replaceAll(regexPontuacao, ""), 12, false, false, 10300);

            XWPFParagraph pageBreak3 = doc.createParagraph();
            pageBreak3.createRun().addBreak(BreakType.PAGE);

            // ---------------------------------// Agradecimentos ------------------------------------------------------

            createCenteredParagraph(doc, "AGRADECIMENTOS", 14, true, false, 0);
            createCenteredParagraph(doc, pdfModel.getAgradecimentos().replaceAll(regexPontuacao, ""), 12, false, false, 1000);

            XWPFParagraph pageBreak4 = doc.createParagraph();
            pageBreak4.createRun().addBreak(BreakType.PAGE);

            // ---------------------------------// Epígrafe ------------------------------------------------------

            createCenteredParagraph(doc, "", 12, false, false, 1900);
            createRightParagraph(doc, pdfModel.getEpigrafe(), 12, false, true, 10300);

            XWPFParagraph pageBreak5 = doc.createParagraph();
            pageBreak5.createRun().addBreak(BreakType.PAGE);
            // ---------------------------------// Resumo e Palavras-Chave ------------------------------------------------------

            createCenteredParagraph(doc, "RESUMO", 14, true, false, 0);
            createCenteredParagraph(doc, pdfModel.getResumo().replaceAll(regexPontuacao, ""), 12, false, false, 1000);

            createCenteredParagraph(doc, "Palavras-chave: " + pdfModel.getPalavrasChave().replaceAll(regexPontuacao, ""), 12, false, false, 1161);

            XWPFParagraph pageBreak6 = doc.createParagraph();
            pageBreak6.createRun().addBreak(BreakType.PAGE);
            // ---------------------------------// Abstract e Keywords ------------------------------------------------------
            createCenteredParagraph(doc, "ABSTRACT", 14, true, false, 0);
            createCenteredParagraph(doc, pdfModel.getResumoEn().replaceAll(regexPontuacao, ""), 12, false, false, 1000);

            createCenteredParagraph(doc, "Keywords: " + pdfModel.getKeywords().replaceAll(regexPontuacao, ""), 12, false, false, 1161);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.write(baos);
            doc.close();

            byte[] docx = baos.toByteArray();

            PdfHistory history = new PdfHistory();
            history.setNomeArquivo("Docx");
            history.setGeradoEm(LocalDateTime.now());
            history.setSessionId(sessionId);
            history.setConteudo(docx);

            return docx;

        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }



    public List<PdfHistory> listPDF(String ip){
        return  historyRepository.findBySessionId(ip);
    }


    public PdfHistory buscarId(UUID id){
        return historyRepository.findById(id).orElseThrow(() -> new RuntimeException("Pdf Inválido"));
    }


    private void addRun(XWPFParagraph p, String text, int size, boolean bold, boolean italic) {
        XWPFRun run = p.createRun();
        run.setText(text);
        run.setFontFamily("Arial");
        run.setFontSize(size);
        run.setBold(bold);
        run.setItalic(italic);
    }

    private void createCenteredParagraph(XWPFDocument doc, String text, int size, boolean bold, boolean italic, int spacingBefore) {
        XWPFParagraph p = doc.createParagraph();
        p.setAlignment(ParagraphAlignment.CENTER);
        if (spacingBefore > 0) p.setSpacingBefore(spacingBefore);
        addRun(p, text, size, bold, italic);
    }

    private void createRightParagraph(XWPFDocument doc, String text, int size, boolean bold, boolean italic, int spacingBefore) {
        XWPFParagraph p = doc.createParagraph();
        p.setAlignment(ParagraphAlignment.RIGHT);
        if (spacingBefore > 0) p.setSpacingBefore(spacingBefore);
        addRun(p, text, size, bold, italic);
    }
}
