FROM ghcr.io/graalvm/graalvm-ce:20.3.0

ENV APP_TARGET target
ENV APP charlescd-circle-matcher.jar
RUN mkdir -p /opt
COPY ${APP_TARGET}/${APP} /opt

ENTRYPOINT exec java ${JAVA_AGENT} ${JAVA_OPTS} ${MEM_PARAMS} -XX:-UseJVMCINativeLibrary -jar /opt/${APP}

