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

package br.com.zup.charlescd.villager.infrastructure.persistence;

import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.agroal.api.AgroalDataSource;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;

@ApplicationScoped
public class DockerRegistryConfigurationRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(DockerRegistryConfigurationRepository.class);

    private AgroalDataSource dataSource;
    private String cryptKey;

    @Inject
    public DockerRegistryConfigurationRepository(AgroalDataSource dataSource, @ConfigProperty(name = "crypt.key") String cryptKey) {
        this.dataSource = dataSource;
        this.cryptKey = cryptKey;
    }

    public void save(DockerRegistryConfigurationEntity entity) {

        var insertSql = "INSERT INTO docker_registry_configuration (id, name, type, author_id, workspace_id, connection_data, created_at) VALUES (?, ?, ?, ?, ?, PGP_SYM_ENCRYPT(?, ?), ?)";

        try (var conn = dataSource.getConnection()) {

            try (var stmt = conn.prepareStatement(insertSql)) {

                entity.id = UUID.randomUUID().toString();
                entity.createdAt = LocalDateTime.now();

                stmt.setString(1, entity.id);
                stmt.setString(2, entity.name);
                stmt.setString(3, entity.type.name());
                stmt.setString(4, entity.authorId);
                stmt.setString(5, entity.workspaceId);
                stmt.setString(6, new ObjectMapper().writeValueAsString(entity.connectionData));
                stmt.setString(7, this.cryptKey);
                stmt.setTimestamp(8, Timestamp.from(entity.createdAt.toInstant(ZoneOffset.UTC)));

                stmt.executeUpdate();

            } catch (JsonProcessingException e) {
                LOGGER.error(e.getMessage(), e);
                throw new RuntimeException(e);
            }

        } catch (SQLException e) {
            LOGGER.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }

    }

    public Optional<DockerRegistryConfigurationEntity> findById(String id) {

        var findSql = "SELECT id, name, type, author_id, workspace_id, PGP_SYM_DECRYPT(connection_data::bytea, ?) as connection_data, created_at FROM docker_registry_configuration WHERE id = ?";

        try (var conn = dataSource.getConnection()) {

            try (var stmt = conn.prepareStatement(findSql)) {
                stmt.setString(1, this.cryptKey);
                stmt.setString(2, id);

                try (var rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        return Optional.of(resultSetExtractor(rs));
                    }

                } catch (JsonMappingException e) {
                    LOGGER.error(e.getMessage(), e);
                    throw new RuntimeException(e);
                } catch (JsonProcessingException e) {
                    LOGGER.error(e.getMessage(), e);
                    throw new RuntimeException(e);
                }

            }
        } catch (SQLException e) {
            LOGGER.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }

        return Optional.empty();
    }

    public void delete(String registryId, String workspaceId) {
        var deleteSql = "DELETE FROM docker_registry_configuration WHERE id = ? AND workspace_id = ?";

        try (var conn = dataSource.getConnection()) {

            try (var stmt = conn.prepareStatement(deleteSql)) {
                stmt.setString(1, registryId);
                stmt.setString(2, workspaceId);
                stmt.executeUpdate();
            }

        } catch (SQLException e) {
            LOGGER.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }

    }

    public Boolean exists(String registryId, String workspaceId) {
        var selectSql = "SELECT count(*) FROM docker_registry_configuration WHERE id = ? AND workspace_id = ?";
        boolean exists = false;

        try (var conn = dataSource.getConnection()) {

            try (var stmt = conn.prepareStatement(selectSql)) {
                stmt.setString(1, registryId);
                stmt.setString(2, workspaceId);
                var rs = stmt.executeQuery();

                if (rs.next()) {
                    int numberOfRows = rs.getInt(1);
                    if (numberOfRows != 0) exists = true;
                } else {
                    System.out.println("error: could not get the record counts");
                }
            }

        } catch (SQLException e) {
            LOGGER.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }

        return exists;
    }

    public List<DockerRegistryConfigurationEntity> listByWorkspaceId(String workspaceId) {
        var findSql = "SELECT id, name, type, author_id, workspace_id, PGP_SYM_DECRYPT(connection_data::bytea, ?) as connection_data, created_at FROM docker_registry_configuration WHERE workspace_id = ?";

        var result = new ArrayList<DockerRegistryConfigurationEntity>();

        try (var conn = dataSource.getConnection()) {

            try (var stmt = conn.prepareStatement(findSql)) {
                stmt.setString(1, this.cryptKey);
                stmt.setString(2, workspaceId);

                try (var rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        result.add(resultSetExtractor(rs));
                    }

                } catch (JsonMappingException e) {
                    LOGGER.error(e.getMessage(), e);
                    throw new RuntimeException(e);
                } catch (JsonProcessingException e) {
                    LOGGER.error(e.getMessage(), e);
                    throw new RuntimeException(e);
                }

            }
        } catch (SQLException e) {
            LOGGER.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }
        return result;
    }

    private DockerRegistryConfigurationEntity resultSetExtractor(ResultSet rs) throws SQLException, JsonProcessingException {
        var entity = new DockerRegistryConfigurationEntity();
        entity.id = rs.getString("id");
        entity.name = rs.getString("name");
        entity.type = RegistryType.valueOf(rs.getString("type"));
        entity.authorId = rs.getString("author_id");
        entity.workspaceId = rs.getString("workspace_id");
        // ATENTION: The connection data has been deserialized to Map because we don't want to put Jackson's annotations in the Entity classes.
        switch (entity.type) {
            case AWS:
                var awsRegistryAuth = deserializeConnectionData(rs);
                entity.connectionData = new DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData(awsRegistryAuth.get("address"), awsRegistryAuth.get("accessKey"), awsRegistryAuth.get("secretKey"), awsRegistryAuth.get("region"));
                break;
            case AZURE:
                var azureRegistryAuth = deserializeConnectionData(rs);
                entity.connectionData = new DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData(azureRegistryAuth.get("address"), azureRegistryAuth.get("username"), azureRegistryAuth.get("password"));
                break;
            default:
                entity.connectionData = null;
        }
        entity.createdAt = rs.getTimestamp("created_at").toLocalDateTime();
        return entity;
    }

    private Map<String, String> deserializeConnectionData(ResultSet rs) throws JsonProcessingException, SQLException {
        return new ObjectMapper().readValue(rs.getString("connection_data"), Map.class);
    }
}
