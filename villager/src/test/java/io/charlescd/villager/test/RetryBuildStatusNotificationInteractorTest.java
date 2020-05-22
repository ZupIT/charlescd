/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.villager.test;

import io.charlescd.villager.infrastructure.persistence.*;
import io.charlescd.villager.interactor.build.impl.RetryBuildStatusNotificationInteractorImpl;
import io.charlescd.villager.service.BuildNotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.exceptions.misusing.InvalidUseOfMatchersException;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
public class RetryBuildStatusNotificationInteractorTest {

    @Mock
    private BuildRepository buildRepository;
    @Mock
    private ModuleRepository moduleRepository;
    @Mock
    private BuildNotificationService notificationService;

    @Captor
    private ArgumentCaptor<BuildEntity> buildEntityArgumentCaptor;

    @Captor
    private ArgumentCaptor<List<ModuleEntity>> modulesListArgumentCaptor;

    @Test
    public void testBuildWithoutFailureStatus() {
        when(buildRepository.findBuildsToNotify()).thenCallRealMethod();
        when(buildRepository.find("callback_status = ?1", CallbackStatus.FAILURE.name())).thenReturn(new MockBasePanacheQuery.MockBuildPanacheQuery());

        var interactor = new RetryBuildStatusNotificationInteractorImpl(buildRepository, moduleRepository, notificationService);

        interactor.execute();

        verify(buildRepository, times(1)).findBuildsToNotify();
        verify(moduleRepository, times(0)).find(eq("build_id = ?1"), anyString());
        verify(notificationService, times(0)).notify(any(), any());
    }

    @Test
    public void testBuildWithFailureStatus() {

        var registryConfigurationId = "a69c3cfb-5587-448f-b011-beae9a4a3fbb";
        var buildId1 = "189fa7e8-2985-46a1-8aad-72c768df3fcd";
        var buildId2 = "ecbb5bb9-f56e-45e6-abdf-d0676647e9ed";
        var moduleId1 = "274fead7-6334-4d58-9834-d1bfa57fd1ef";
        var moduleId2 = "84066c5c-a6e9-4343-8713-1f0b864c92cb";

        var mockBuildPanacheQuery = new MockBasePanacheQuery.MockBuildPanacheQuery();
        mockBuildPanacheQuery.add("tag_1", "http://callback/test_1", "9ef1c3e8-8eff-4be2-8a2f-b32dfe07e0af", buildId1);
        mockBuildPanacheQuery.add("tag_2", "http://callback/test_2", "3ab17a5b-a7ae-497f-a644-05cb63980d07", buildId2);

        when(buildRepository.findBuildsToNotify()).thenCallRealMethod();
        when(buildRepository.find("callback_status = ?1", CallbackStatus.FAILURE.name())).thenReturn(mockBuildPanacheQuery);

        when(moduleRepository.findByBuildId(anyString())).thenCallRealMethod();
        when(moduleRepository.find(eq("build_id = ?1"), anyString())).thenAnswer(invocationOnMock -> {
            var buildId = invocationOnMock.getArguments()[1];
            if (buildId.equals(buildId1)) {
                var mockModulePanacheQuery = new MockBasePanacheQuery.MockModulePanacheQuery();
                mockModulePanacheQuery.add(moduleId1, "4f94780e-ebe1-4d4c-8a97-e3b01997492a", "module_1", "tag_1", buildId1, registryConfigurationId, "http://registry/test");
                return mockModulePanacheQuery;
            }
            if (buildId.equals(buildId2)) {
                var mockModulePanacheQuery = new MockBasePanacheQuery.MockModulePanacheQuery();
                mockModulePanacheQuery.add(moduleId2, "5ffa9132-0569-4216-9037-824f9d0f2755", "module_2", "tag_2", buildId2, registryConfigurationId, "http://registry/test");
                return mockModulePanacheQuery;
            }
            throw new InvalidUseOfMatchersException(String.format("Build id %s does not match", buildId));
        });

        var interactor = new RetryBuildStatusNotificationInteractorImpl(buildRepository, moduleRepository, notificationService);

        interactor.execute();

        verify(buildRepository, times(1)).find("callback_status = ?1", CallbackStatus.FAILURE.name());
        verify(moduleRepository, times(2)).find(eq("build_id = ?1"), anyString());
        verify(notificationService, times(2)).notify(buildEntityArgumentCaptor.capture(), modulesListArgumentCaptor.capture());

        var buildEntityArgumentCaptorAllValues = buildEntityArgumentCaptor.getAllValues();
        assertThat(buildEntityArgumentCaptorAllValues.get(0).id, is(buildId1));
        assertThat(buildEntityArgumentCaptorAllValues.get(0).tagName, is("tag_1"));
        assertThat(buildEntityArgumentCaptorAllValues.get(0).callbackUrl, is("http://callback/test_1"));
        assertThat(buildEntityArgumentCaptorAllValues.get(0).circleId, is("9ef1c3e8-8eff-4be2-8a2f-b32dfe07e0af"));
        assertThat(buildEntityArgumentCaptorAllValues.get(0).createdAt, notNullValue());
        assertThat(buildEntityArgumentCaptorAllValues.get(1).id, is(buildId2));
        assertThat(buildEntityArgumentCaptorAllValues.get(1).tagName, is("tag_2"));
        assertThat(buildEntityArgumentCaptorAllValues.get(1).callbackUrl, is("http://callback/test_2"));
        assertThat(buildEntityArgumentCaptorAllValues.get(1).circleId, is("3ab17a5b-a7ae-497f-a644-05cb63980d07"));
        assertThat(buildEntityArgumentCaptorAllValues.get(1).createdAt, notNullValue());

        var modulesListArgumentCaptorAllValues = modulesListArgumentCaptor.getAllValues();
        assertThat(modulesListArgumentCaptorAllValues.get(0).get(0).id, is(moduleId1));
        assertThat(modulesListArgumentCaptorAllValues.get(0).get(0).name, is("module_1"));
        assertThat(modulesListArgumentCaptorAllValues.get(0).get(0).tagName, is("tag_1"));
        assertThat(modulesListArgumentCaptorAllValues.get(0).get(0).buildEntityId, is(buildId1));
        assertThat(modulesListArgumentCaptorAllValues.get(0).get(0).externalId, is("4f94780e-ebe1-4d4c-8a97-e3b01997492a"));
        assertThat(modulesListArgumentCaptorAllValues.get(0).get(0).registryConfigurationId, is(registryConfigurationId));
        assertThat(modulesListArgumentCaptorAllValues.get(0).get(0).registry, is("http://registry/test"));
        assertThat(modulesListArgumentCaptorAllValues.get(0).get(0).status, is(ModuleBuildStatus.CREATED));
        assertThat(modulesListArgumentCaptorAllValues.get(1).get(0).id, is(moduleId2));
        assertThat(modulesListArgumentCaptorAllValues.get(1).get(0).name, is("module_2"));
        assertThat(modulesListArgumentCaptorAllValues.get(1).get(0).tagName, is("tag_2"));
        assertThat(modulesListArgumentCaptorAllValues.get(1).get(0).buildEntityId, is(buildId2));
        assertThat(modulesListArgumentCaptorAllValues.get(1).get(0).externalId, is("5ffa9132-0569-4216-9037-824f9d0f2755"));
        assertThat(modulesListArgumentCaptorAllValues.get(1).get(0).registryConfigurationId, is(registryConfigurationId));
        assertThat(modulesListArgumentCaptorAllValues.get(1).get(0).registry, is("http://registry/test"));
        assertThat(modulesListArgumentCaptorAllValues.get(1).get(0).status, is(ModuleBuildStatus.CREATED));

    }

}
