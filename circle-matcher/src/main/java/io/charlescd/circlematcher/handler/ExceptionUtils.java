package io.charlescd.circlematcher.handler;

import java.util.ArrayList;
import java.util.UUID;

public class ExceptionUtils {

    public static DefaultErrorResponse createNotFoundErrorResponse(String message, String sourceString) {
        Source source = new Source(sourceString);
       return new DefaultErrorResponse( UUID.randomUUID().toString(),
                new ArrayList<String>(),
                "Not found",
                message,
                "404",
                source
                ,
                "matcher"
       );
    }

    public static DefaultErrorResponse createBadRequestError(String message, String sourceString) {
        Source source = new Source(sourceString);
        return new DefaultErrorResponse( UUID.randomUUID().toString(),
                new ArrayList<String>(),
                "Bad Request",
                message,
                "400",
                source,
                "matcher"
        );
    }

    public static DefaultErrorResponse createInternalServerError(String message, String sourceString) {
        Source source = new Source(sourceString);
        return new DefaultErrorResponse( UUID.randomUUID().toString(),
                new ArrayList<String>(),
                "Internal Server Error",
                message,
                "500",
                source,
                "matcher"
        );
    }
}
