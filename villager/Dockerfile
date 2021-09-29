FROM fabric8/java-alpine-openjdk11-jre@sha256:ab9b9fbbae6a45bb194b5b899822c15bbcd1cd5920253f04f1d25a1918309d45
ENV JAVA_OPTIONS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV AB_ENABLED=jmx_exporter
COPY target/lib/* /deployments/lib/
COPY target/*-runner.jar /deployments/app.jar
ENTRYPOINT [ "/deployments/run-java.sh" ]