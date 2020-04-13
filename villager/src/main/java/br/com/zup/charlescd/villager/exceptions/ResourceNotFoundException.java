/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    private ResourceEnum resource;

    public ResourceNotFoundException(ResourceEnum resource) {
        super(String.format("Resource %s not found", resource.name()));
        this.resource = resource;
    }

    public ResourceEnum getResource() {
        return resource;
    }

    public enum ResourceEnum {
        DOCKER_REGISTRY
    }
}
