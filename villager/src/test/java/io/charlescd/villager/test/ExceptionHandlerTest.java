package io.charlescd.villager.test;

import io.charlescd.villager.api.misc.ExceptionHandler;
import io.charlescd.villager.exceptions.ThirdyPartyIntegrationException;
import org.junit.jupiter.api.Test;

import javax.ws.rs.core.Response;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class ExceptionHandlerTest {

    @Test
    public void testIllegarArgumentationException() {
        ExceptionHandler handler = new ExceptionHandler();
        Response response = handler.toResponse(new IllegalArgumentException());
        assertThat(response.getStatus(), is(Response.Status.BAD_REQUEST.getStatusCode()));
        assertThat(response.getEntity().toString(), is("{}"));
    }

    @Test
    public void testThirdyPartyIntegrationException() {
        ExceptionHandler handler = new ExceptionHandler();
        Response response = handler.toResponse(new ThirdyPartyIntegrationException("Connection error"));
        assertThat(response.getStatus(), is(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode()));
        assertThat(response.getEntity().toString(), anything("Connection error"));

    }

    @Test
    public void testGeneralException() {
        ExceptionHandler handler = new ExceptionHandler();
        Response response = handler.toResponse(new Exception());
        assertThat(response.getStatus(), is(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode()));
        assertThat(response.getEntity().toString(), is("{}"));
    }
}
