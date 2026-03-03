package mxteuss.java.service;

import lombok.Data;
import mxteuss.java.model.PdfModel;
import org.openpdf.text.*;

import org.openpdf.text.pdf.ColumnText;
import org.openpdf.text.pdf.PdfContentByte;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.openpdf.text.pdf.BaseFont;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Data
@Service
public class PdfService {

    public byte[] gerarPdfABNT(PdfModel pdfModel)
    {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        String regex = "\\w";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher;

        try {
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);
            document.setMargins(
                    72f,
                    50f,
                    85.05f,
                    50f
            );
            document.open();

            Font fontNormal = new Font(Font.TIMES_ROMAN, 12, Font.NORMAL);
            Font fontItalic = new Font(Font.ITALIC, 12, Font.TIMES_ROMAN);
            Font fontBold = new Font(Font.TIMES_ROMAN, 14, Font.BOLD);

            // ---------------------------------// CAPA ------------------------------------------------------------
            matcher = pattern.matcher(pdfModel.getInstituicao());
            Paragraph instituicao = new Paragraph(matcher.toString().toUpperCase(), fontBold);
                instituicao.setAlignment(Paragraph.ALIGN_CENTER);
                instituicao.setSpacingBefore(50f);
                document.add(instituicao);

                matcher = pattern.matcher(pdfModel.getCurso());
                Paragraph curso =  new Paragraph(matcher.toString().toUpperCase(), fontNormal);
                curso.setAlignment(Paragraph.ALIGN_CENTER);
                document.add(curso);

                matcher = pattern.matcher(pdfModel.getNome());
                Paragraph nome = new Paragraph(matcher.toString().toUpperCase(), fontBold);
                nome.setAlignment(Paragraph.ALIGN_CENTER);
                nome.setSpacingBefore(100f);
                document.add(nome);

                matcher = pattern.matcher(pdfModel.getTitulo());
                Paragraph titulo = new Paragraph(matcher.toString().toUpperCase(), fontBold);
                titulo.setAlignment(Paragraph.ALIGN_CENTER);
                titulo.setSpacingBefore(180f);
                document.add(titulo);

                PdfContentByte canvas = writer.getDirectContent();

                canvas.setFontAndSize(BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED), 12);
                float Centro = PageSize.A4.getWidth() / 2;

                matcher = pattern.matcher(pdfModel.getCidade());
                canvas.showTextAligned(PdfContentByte.ALIGN_CENTER,
                    matcher.toString().toUpperCase(),
                    Centro, 100f,0);

                matcher = pattern.matcher(pdfModel.getAno());
                canvas.showTextAligned(PdfContentByte.ALIGN_CENTER,
                    matcher.toString(),
                    Centro, 85f,0);

// ---------------------------------// FOLHA DE ROSTO ------------------------------------------------------------
            document.newPage();

            document.add(nome);
            document.add(titulo);

            ColumnText ct = new ColumnText(canvas);

            ct.setSimpleColumn( 226.8f,
                    200f,
                    PageSize.A4.getWidth() - 85.05f,
                   400f);
            ct.setAlignment(Element.ALIGN_RIGHT);


            String tipo = String.valueOf(pattern.matcher(pdfModel.getTipoTrabalho()));
            String objetivo = String.valueOf(pattern.matcher(pdfModel.getObjetivo()));

            Paragraph paragraph =  new Paragraph(String.format("%s para obtenção do título de %s em %s apresentado à %s ",
                    Objects.equals(pdfModel.getTipoTrabalho(), "TCC") ? "Trabalho de Conclusão de Curso" : tipo,
                    objetivo,
                    pattern.matcher(pdfModel.getCurso()),
                    pattern.matcher(pdfModel.getInstituicao())), fontNormal);
            paragraph.setAlignment(Paragraph.ALIGN_RIGHT);
            paragraph.setSpacingBefore(80f);
            ct.addElement(paragraph);


            matcher = pattern.matcher(pdfModel.getOrientador());
            Paragraph orientador = new Paragraph("Orientador(a): " + matcher, fontNormal);
            orientador.setAlignment(Paragraph.ALIGN_RIGHT);
            orientador.setSpacingBefore(40f);
            ct.addElement(orientador);

            try{
                ct.go();
            }catch(Exception e){
                System.out.println("Error:" + e.getMessage());
            }

            canvas.setFontAndSize(BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED), 12);
            canvas.showTextAligned(PdfContentByte.ALIGN_CENTER,
                    pattern.matcher(pdfModel.getCidade()).toString(),
                    Centro, 100f,0);

            canvas.showTextAligned(PdfContentByte.ALIGN_CENTER,
                    pattern.matcher(pdfModel.getAno()).toString(),
                    Centro, 85f,0);


            // ---------------------------------// DEDICATÓRIA ------------------------------------------------------------
            document.newPage();

            ColumnText ct1 = new ColumnText(canvas);

            ct1.setSimpleColumn( 226.8f,
                    190f,
                    PageSize.A4.getWidth() - 85.05f,
                    56.7f);
            ct1.setAlignment(Element.ALIGN_RIGHT);

            matcher = pattern.matcher(pdfModel.getDedicatoria());
            Paragraph dedicatoria = new Paragraph(matcher.toString(), fontNormal);
            dedicatoria.setAlignment(Paragraph.ALIGN_RIGHT);
            ct1.addElement(dedicatoria);

            try{
                ct1.go();
            }
            catch (DocumentException e) {
                System.out.println("Error:" + e.getMessage());
            }

            // ---------------------------------// AGRADECIMENTOS ------------------------------------------------------------
            document.newPage();

            Paragraph titulo3 = new Paragraph("AGRADECIMENTOS", fontBold);
            titulo3.setAlignment(Paragraph.ALIGN_CENTER);

            matcher = pattern.matcher(pdfModel.getAgradecimentos());
            Paragraph agradecimentos = new  Paragraph(matcher.toString(), fontNormal);
            agradecimentos.setAlignment(Paragraph.ALIGN_CENTER);
            agradecimentos.setSpacingBefore(50f);
            document.add(titulo3);
            document.add(agradecimentos);

            // ---------------------------------// Epígrafe ------------------------------------------------------------
            document.newPage();

            matcher = pattern.matcher(pdfModel.getEpigrafe());
            Paragraph epigrafe = new Paragraph(matcher.toString(), fontItalic);
            epigrafe.setAlignment(Paragraph.ALIGN_RIGHT);
            ct1.addElement(epigrafe);

            try{
                ct1.go();
            }
            catch (DocumentException e) {
                System.out.println("Error:" + e.getMessage());
            }

            // ---------------------------------// RESUMO ------------------------------------------------------------
            document.newPage();

            Paragraph titulo4 = new Paragraph("RESUMO", fontBold);
            titulo4.setAlignment(Paragraph.ALIGN_CENTER);

            matcher = pattern.matcher(pdfModel.getResumo());
            Paragraph resumo = new  Paragraph(matcher.toString(), fontNormal);
            resumo.setAlignment(Paragraph.ALIGN_CENTER);
            resumo.setSpacingBefore(50f);

            matcher = pattern.matcher(pdfModel.getKeywords());
            Paragraph palavrasChave = new Paragraph();
            palavrasChave.add(new Chunk("Palavras-chave:  ", FontFactory.getFont(FontFactory.TIMES_ROMAN, 12, Font.BOLD) ));
            palavrasChave.add(new Chunk(matcher.toString()));
            palavrasChave.setAlignment(Paragraph.ALIGN_CENTER);
            palavrasChave.setSpacingBefore(58.05f);


            document.add(titulo4);
            document.add(resumo);
            document.add(palavrasChave);


            // ---------------------------------// ABSTRACT ------------------------------------------------------------
            document.newPage();

            Paragraph titulo5 = new Paragraph("ABSTRACT", fontBold);
            titulo5.setAlignment(Paragraph.ALIGN_CENTER);

            matcher = pattern.matcher(pdfModel.getResumoEn());
            Paragraph resumoEn = new  Paragraph(matcher.toString(), fontNormal);
            resumoEn.setAlignment(Paragraph.ALIGN_CENTER);
            resumoEn.setSpacingBefore(50f);

            matcher = pattern.matcher(pdfModel.getKeywords());
            Paragraph keywords = new Paragraph();
            keywords.add(new Chunk("Keywords:  ", FontFactory.getFont(FontFactory.TIMES_ROMAN, 12, Font.BOLD) ));
            keywords.add(new Chunk(matcher.toString()));
            keywords.setAlignment(Paragraph.ALIGN_CENTER);
            keywords.setSpacingBefore(58.05f);
            document.add(titulo5);
            document.add(resumoEn);
            document.add(keywords);




            document.close();
            return outputStream.toByteArray();

        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }

}
