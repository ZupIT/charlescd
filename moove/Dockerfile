ARG BUILD_IMAGE=rodrigomedeirosf/maven-without-root
FROM $BUILD_IMAGE
WORKDIR /home/maven
COPY --chown=1000:1000 . .
RUN mvn -Dmaven.repo.local=/home/maven/.m2/repository de.qaware.maven:go-offline-maven-plugin:1.1.0:resolve-dependencies
RUN rm -rf /home/maven/*