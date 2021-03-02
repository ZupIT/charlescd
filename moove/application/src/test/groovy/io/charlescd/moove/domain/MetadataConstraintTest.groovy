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

package io.charlescd.moove.domain

import io.charlescd.moove.domain.validation.MetadataValidator
import spock.lang.Specification

class MetadataConstraintTest  extends Specification {

    def 'should return not valid if metadata content key is empty'() {
        given:
        def metadataValidator = new MetadataValidator();
        def metadataContent = new HashMap<String, String>()
        metadataContent.put("", "value")
        def metadata = new Metadata(MetadataScopeEnum.APPLICATION, metadataContent)

        when:
        def valid = metadataValidator.isValid(metadata, null)

        then:
        assert !valid

    }

    def 'should return not valid if metadata content value is empty'() {
        given:
        def metadataValidator = new MetadataValidator();
        def metadataContent = new HashMap<String, String>()
        metadataContent.put("key", "")
        def metadata = new Metadata(MetadataScopeEnum.APPLICATION, metadataContent)

        when:
        def valid = metadataValidator.isValid(metadata, null)

        then:
        assert !valid
    }

    def 'should return not valid if metadata content key size is longer than 63 '() {
        given:
        def metadataValidator = new MetadataValidator();
        def metadataContent = new HashMap<String, String>()
        metadataContent.put("k".repeat(64), "value")
        def metadata = new Metadata(MetadataScopeEnum.APPLICATION, metadataContent)

        when:
        def valid = metadataValidator.isValid(metadata, null)

        then:
        assert !valid
    }

    def 'should return not valid if metadata content value size is longer than 253 '() {
        given:
        def metadataValidator = new MetadataValidator();
        def metadataContent = new HashMap<String, String>()
        metadataContent.put("key", "v".repeat(254))
        def metadata = new Metadata(MetadataScopeEnum.APPLICATION, metadataContent)

        when:
        def valid = metadataValidator.isValid(metadata, null)

        then:
        assert !valid
    }

    def 'should return valid if metadata is null'() {
        given:
        def metadataValidator = new MetadataValidator();
        def metadataContent = new HashMap<String, String>()
        metadataContent.put("key", "value")
        def metadata = null

        when:
        def valid = metadataValidator.isValid(metadata, null)

        then:
        assert valid
    }


    def 'should return valid if metadata content has valid keys and values'() {
        given:
        def metadataValidator = new MetadataValidator();
        def metadataContent = new HashMap<String, String>()
        metadataContent.put("k".repeat(63), "v".repeat(253))
        def metadata = new Metadata(MetadataScopeEnum.APPLICATION, metadataContent)

        when:
        def valid = metadataValidator.isValid(metadata, null)

        then:
        assert valid
    }
}
