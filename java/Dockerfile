FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM public.ecr.aws/lambda/java:21
COPY --from=build /app/target/java-0.0.1-SNAPSHOT.jar ${LAMBDA_TASK_ROOT}/lib/
CMD ["mxteuss.java.handler.Handler::handleRequest"]