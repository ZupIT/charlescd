/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.test;

import br.com.zup.charlescd.villager.infrastructure.persistence.BuildEntity;
import br.com.zup.charlescd.villager.infrastructure.persistence.ComponentEntity;
import br.com.zup.charlescd.villager.infrastructure.persistence.ModuleEntity;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;

import javax.persistence.LockModeType;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

class MockBasePanacheQuery<T> implements PanacheQuery<T> {
    @Override
    public <T1 extends T> PanacheQuery<T1> page(Page page) {
        return null;
    }

    @Override
    public <T1 extends T> PanacheQuery<T1> page(int i, int i1) {
        return null;
    }

    @Override
    public <T1 extends T> PanacheQuery<T1> nextPage() {
        return null;
    }

    @Override
    public <T1 extends T> PanacheQuery<T1> previousPage() {
        return null;
    }

    @Override
    public <T1 extends T> PanacheQuery<T1> firstPage() {
        return null;
    }

    @Override
    public <T1 extends T> PanacheQuery<T1> lastPage() {
        return null;
    }

    @Override
    public boolean hasNextPage() {
        return false;
    }

    @Override
    public boolean hasPreviousPage() {
        return false;
    }

    @Override
    public int pageCount() {
        return 0;
    }

    @Override
    public Page page() {
        return null;
    }

    @Override
    public <T1 extends T> PanacheQuery<T1> withLock(LockModeType lockModeType) {
        return null;
    }

    @Override
    public <T1 extends T> PanacheQuery<T1> withHint(String s, Object o) {
        return null;
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public <T1 extends T> List<T1> list() {
        return null;
    }

    @Override
    public <T1 extends T> Stream<T1> stream() {
        return null;
    }

    @Override
    public <T1 extends T> T1 firstResult() {
        return null;
    }

    @Override
    public <T1 extends T> Optional<T1> firstResultOptional() {
        return Optional.empty();
    }

    @Override
    public <T1 extends T> T1 singleResult() {
        return null;
    }

    @Override
    public <T1 extends T> Optional<T1> singleResultOptional() {
        return Optional.empty();
    }

    static class MockComponentPanacheQuery extends MockBasePanacheQuery<ComponentEntity> {

        private List<ComponentEntity> list = new ArrayList<>();

        public void add(String id, String name, String tagName, String moduleId) {
            var componentEntity = ComponentEntity.create(name, tagName, moduleId);
            componentEntity.id = id;
            list.add(componentEntity);
        }

        @Override
        public List<ComponentEntity> list() {
            return list;
        }

    }

    static class MockModulePanacheQuery extends MockBasePanacheQuery<ModuleEntity> {

        private List<ModuleEntity> list = new ArrayList<>();

        public void add(String id, String externalId, String name, String tagName, String buildId, String registryConfigurationId, String registryUrl) {
            var module = ModuleEntity.create(externalId, name, tagName, buildId, registryConfigurationId, registryUrl);
            module.id = id;
            list.add(module);
        }

        public void add(ModuleEntity module) {
            list.add(module);
        }

        @Override
        public List<ModuleEntity> list() {
            return list;
        }

    }

    static class MockBuildPanacheQuery extends MockBasePanacheQuery<BuildEntity> {

        private List<BuildEntity> list = new ArrayList<>();

        public void add(String tag, String callback, String circleId, String buildId) {
            var build = BuildEntity.create(tag, callback, circleId);
            build.id = buildId;
            list.add(build);
        }

        @Override
        public List<BuildEntity> list() {
            return list;
        }

        @Override
        public BuildEntity firstResult() {
            return list.get(0);
        }
    }
}