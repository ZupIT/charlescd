package io.charlescd.villager.test;

import io.charlescd.villager.api.handlers.impl.GetDockerRegistryTagHandler;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@ExtendWith(MockitoExtension.class)
public class GetDockerRegistryTagHandlerTest {
    @Test
    public void createInput() {
        var workspaceId = "03232654-a863-4e87-b4d0-5536ad0d119f";
        var name = "V-1.0.0";
        var componentName = "dummyComponent";
        var registryConfigurationId = "2278ba03-c61f-4ad2-aa69-05b91400c470";
        var handler = new GetDockerRegistryTagHandler(workspaceId, registryConfigurationId, componentName, name);

        var input = handler.handle();
        assertThat(input.getArtifactName(), is(componentName));
        assertThat(input.getArtifactRepositoryConfigurationId(), is(registryConfigurationId));
        assertThat(input.getName(), is(name));
        assertThat(input.getWorkspaceId(), is(workspaceId));
    }
}
