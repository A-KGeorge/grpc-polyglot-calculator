# Java Subtract Server Dockerfile
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY java/ .
COPY proto/ ../proto/
RUN mvn clean package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 50052

CMD ["java", "-jar", "app.jar"]
