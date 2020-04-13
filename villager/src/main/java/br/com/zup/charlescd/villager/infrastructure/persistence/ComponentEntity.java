/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.persistence;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.*;

@Entity(name = "component")
public class ComponentEntity extends PanacheEntityBase {

    @Id
    public String id;

    @Column(name = "name")
    public String name;

    @Column(name = "tag_name")
    public String tagName;

    @Column(name = "module_id")
    public String moduleEntityId;

    public static ComponentEntity create(String name, String tagName, String moduleId) {

        ComponentEntity entity = new ComponentEntity();

        entity.id = UUID.randomUUID().toString();
        entity.name = name;
        entity.tagName = tagName;
        entity.moduleEntityId = moduleId;

        return entity;
    }

}
