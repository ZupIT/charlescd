FROM ghcr.io/graalvm/graalvm-ce@sha256:8ea9e44a05e7b2ff4b8765024de8bfdfcb7300482feb1865f84652432c510673

ENV APP_TARGET target
ENV APP charlescd-circle-matcher.jar
RUN mkdir -p /opt
COPY ${APP_TARGET}/${APP} /opt

ENTRYPOINT exec java ${JAVA_AGENT} ${JAVA_OPTS} ${MEM_PARAMS} -XX:-UseJVMCINativeLibrary -jar /opt/${APP}

