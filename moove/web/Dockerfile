FROM adoptopenjdk/openjdk11@sha256:03c0a9b113677ee32f6927bd877d8705ef62c2ecd8e49ba680e17a449da5ccf3

ENV APP_TARGET target
ENV APP web.jar

RUN mkdir -p /opt
COPY ${APP_TARGET}/${APP} /opt

ENTRYPOINT exec java ${JAVA_AGENT} ${JAVA_OPTS} ${MEM_PARAMS} -jar /opt/${APP}
