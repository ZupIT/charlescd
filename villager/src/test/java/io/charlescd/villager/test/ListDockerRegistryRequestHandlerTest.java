package io.charlescd.villager.test;

import io.charlescd.villager.api.handlers.impl.ListDockerRegistryRequestHandler;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@ExtendWith(MockitoExtension.class)
public class ListDockerRegistryRequestHandlerTest {
    @Test
    public void test() {
        var workspaceId = "03232654-a863-4e87-b4d0-5536ad0d119f";

        var handler = new ListDockerRegistryRequestHandler(workspaceId);

        var result = handler.handle();
        assertThat(result.getWorkspaceId(), is(workspaceId));
    }
}
