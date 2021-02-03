package io.charlescd.circlematcher.handler;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class ExceptionUtils {

    public static DefaultErrorResponse createNotFoundErrorResponse(String message, String sourceString) {
        Source source = new Source(sourceString);
        return new DefaultErrorResponse(UUID.randomUUID().toString(),
                new ArrayList<String>(),
                "Not found",
                message,
                "404",
                source,
                getMetaInfo()
       );
    }

    public static DefaultErrorResponse createBadRequestError(String message, String sourceString) {
        Source source = new Source(sourceString);
        return new DefaultErrorResponse(UUID.randomUUID().toString(),
                new ArrayList<String>(),
                "Bad Request",
                message,
                "400",
                source,
                getMetaInfo()
        );
    }

    public static DefaultErrorResponse createBusinessExceptionError(
            String message,
            String title,
            String sourceString,
            Exception exception) {
        Source source = new Source(sourceString);
        return new DefaultErrorResponse(UUID.randomUUID().toString(),
                new ArrayList<String>(),
                title,
                message,
                "400",
                source,
                getMetaInfo()
        );
    }

    public static DefaultErrorResponse createInternalServerError(String message, String sourceString) {
        Source source = new Source(sourceString);
        return new DefaultErrorResponse(UUID.randomUUID().toString(),
                new ArrayList<String>(),
                "Internal Server Error",
                message,
                "500",
                source,
                getMetaInfo()
        );
    }

    private static Map<String, String> getMetaInfo() {
        Map<String, String> metaInfo = new HashMap<String, String>();
        metaInfo.put("timestamp", LocalDateTime.now().toString());
        metaInfo.put("component", "circle-matcher");
        return metaInfo;
    }
}
