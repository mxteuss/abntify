package mxteuss.java.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import mxteuss.java.DTO.TraducaoResponse;
import mxteuss.java.JavaApplication;
import mxteuss.java.model.ArchiveHistory;
import mxteuss.java.model.ArchiveModel;
import mxteuss.java.service.AiService;
import mxteuss.java.service.ArchiveService;
import org.apache.commons.codec.binary.Base64;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import java.util.*;

@Slf4j
public class Handler implements RequestHandler<APIGatewayV2HTTPEvent, APIGatewayV2HTTPResponse> {

    private static final ApplicationContext context;

    static {
        System.out.println("INICIANDO SPRING");
        context = SpringApplication.run(JavaApplication.class);
        System.out.println("SPRING INICIADO");
    }

    private final ArchiveService archiveService;

    public Handler() {
        this.archiveService = context.getBean(ArchiveService.class);
    }

    ObjectMapper mapper = new ObjectMapper();

    @Override
    public APIGatewayV2HTTPResponse handleRequest(APIGatewayV2HTTPEvent event, Context context) {
        assert event != null;
        String routeKey = event.getRouteKey();

        ArchiveModel archiveModel = new ArchiveModel();
        AiService aiService = new AiService();
        String sessionId;
        switch (routeKey) {
            case "GET /listar":
                try {

                    String ip = event.getRequestContext()
                            .getHttp()
                            .getSourceIp();

                    List<ArchiveHistory> lista = archiveService.listPDF(ip);

                    return APIGatewayV2HTTPResponse.builder()
                            .withStatusCode(200)
                            .withBody(lista.toString())
                            .build();
                } catch (Exception e) {
                    log.error("Erro: {}", e.getMessage());

                    return APIGatewayV2HTTPResponse.builder()
                            .withStatusCode(500)
                            .withBody("Erro interno")
                            .build();
                }
            case "POST /gerar-pdf":
                try {

                    archiveModel = mapper.readValue(event.getBody(), ArchiveModel.class);

                    sessionId = event.getHeaders().get("X-Session-Id");

                    Map<String, String> headers = new HashMap<>();

                    headers.put("Content-Type", "application/pdf");
                    headers.put("Content-Disposition", "attachment; filename=\"abnt.pdf\"");
                    byte[] pdf = archiveService.gerarPdfABNT(archiveModel, sessionId);

                    System.out.println("PDF gerado. Bytes = " + pdf.length);

                    String base64 = Base64.encodeBase64String(pdf);
                    System.out.println("VERSAO_2026-06-18_001");
                    return APIGatewayV2HTTPResponse.builder()
                            .withStatusCode(200)
                            .withHeaders(headers)
                            .withBody(base64)
                            .withIsBase64Encoded(true)
                            .build();

                } catch (Exception e) {
                    log.error("Erro: {}", e.getMessage());

                    return APIGatewayV2HTTPResponse.builder()
                            .withStatusCode(500)
                            .withBody("Erro interno")
                            .build();
                }

            case "POST /gerar-docx":
                try {
                    archiveModel = mapper.readValue(event.getBody(), ArchiveModel.class);
                    sessionId = event.getHeaders().get("X-Session-Id");
                    byte[] doc = archiveService.gerarDOC(archiveModel, sessionId);

                    Map<String, String> headers = new HashMap<>();
                    headers.put("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                    headers.put("Content-Disposition", "attachment; filename=\"abnt.docx\"");

                    String base64 = Base64.encodeBase64String(doc);

                    System.out.println("VERSAO_2026-06-18_001");
                    return APIGatewayV2HTTPResponse.builder()
                            .withStatusCode(200)
                            .withHeaders(headers)
                            .withBody(base64)
                            .withIsBase64Encoded(true)
                            .build();
                } catch (Exception e) {
                    log.error("Erro: {}", e.getMessage());

                    return APIGatewayV2HTTPResponse.builder()
                            .withStatusCode(500)
                            .withBody("Erro interno")
                            .build();
                }
            case "POST /traduzir":
                try {
                    archiveModel = mapper.readValue(event.getBody(), ArchiveModel.class);
                    System.out.println("Recebeu");
                    aiService.traduzirResumo(archiveModel);
                    System.out.println("Traduziu");

                } catch (JsonProcessingException e) {
                    log.error("Erro: {}", e.getMessage());
                }

                TraducaoResponse traducaoResponse = new TraducaoResponse(archiveModel.getResumoEn(),
                                                                         archiveModel.getKeywords());

                try {
                    return APIGatewayV2HTTPResponse.builder()
                            .withStatusCode(200)
                            .withBody(mapper.writeValueAsString(traducaoResponse))
                            .build();
                } catch (JsonProcessingException e) {
                    log.error("Erro: {}", e.getMessage());
                }

            case "/download/{id}":
                UUID id = UUID.fromString(event.getPathParameters().get("id"));

                ArchiveHistory archiveHistory = archiveService.buscarId(id);


                return APIGatewayV2HTTPResponse.builder()
                        .withHeaders(Map.of(
                                "Content-Type", "application/pdf",
                                "Content-Disposition", "attachment; filename=\"" + archiveHistory.getNomeArquivo() + "\""
                        ))
                        .withBody(Base64.encodeBase64String(archiveHistory.getConteudo()))
                        .withIsBase64Encoded(true)
                        .build();

            default:
                return APIGatewayV2HTTPResponse.builder()
                        .withStatusCode(404)
                        .withBody("Método não encontrado")
                        .build();
        }
    }

}

