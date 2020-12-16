package io.charlescd.villager.persistence;

import io.agroal.api.AgroalDataSource;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.utils.DockerRegistryTestUtils;
import org.jooq.tools.jdbc.MockConnection;
import org.jooq.tools.jdbc.MockDataProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DockerRegistryConfigurationRepositoryTest {

    private static final String ID = "1a3d413d-2255-4a1b-94ba-82e7366e4342";
    @Mock
    private AgroalDataSource dataSource;


    @Test
    public void testSaveSuccess() throws SQLException {

        when(dataSource.getConnection()).thenReturn(getConnection());

        DockerRegistryConfigurationRepository repository = newRepository();

        assertDoesNotThrow(() -> repository.save(getEntity()));
    }

    @Test
    public void testSaveError() throws SQLException {

        when(dataSource.getConnection()).thenThrow(SQLException.class);

        DockerRegistryConfigurationRepository repository = newRepository();

        assertThrows(RuntimeException.class, () -> repository.save(getEntity()));
    }

    public void testFindByIdSuccess() {
        //TODO Implement
    }

    @Test
    public void testFindByError() throws SQLException {

        when(dataSource.getConnection()).thenThrow(SQLException.class);

        DockerRegistryConfigurationRepository repository = newRepository();

        assertThrows(RuntimeException.class, () -> repository.findById(ID));
    }

    @Test
    public void testDeleteSuccess() throws SQLException {

        when(dataSource.getConnection()).thenReturn(getConnection());

        DockerRegistryConfigurationRepository repository = newRepository();

        assertDoesNotThrow(() -> repository.delete(ID, ID));
    }

    @Test
    public void testDeleteError() throws SQLException {

        when(dataSource.getConnection()).thenThrow(SQLException.class);

        DockerRegistryConfigurationRepository repository = newRepository();

        assertThrows(RuntimeException.class, () -> repository.delete(ID, ID));
    }

    @Test
    public void testExistsSuccess() throws SQLException {

        when(dataSource.getConnection()).thenReturn(getConnection());

        DockerRegistryConfigurationRepository repository = newRepository();

        assertDoesNotThrow(() -> repository.exists(ID, ID));
    }

    @Test
    public void testExistsError() throws SQLException {

        when(dataSource.getConnection()).thenThrow(SQLException.class);

        DockerRegistryConfigurationRepository repository = newRepository();

        assertThrows(RuntimeException.class, () -> repository.exists(ID, ID));
    }

    public void testListByWorkspaceIdSuccess() {
        //TODO Implement
    }

    @Test
    public void testListByWorkspaceIdError() throws SQLException {

        when(dataSource.getConnection()).thenThrow(SQLException.class);

        DockerRegistryConfigurationRepository repository = newRepository();

        assertThrows(RuntimeException.class, () -> repository.listByWorkspaceId(ID));
    }

    private MockConnection getConnection() {
        MockDataProvider provider = new PostgresProvider();
        return new MockConnection(provider);
    }

    private DockerRegistryConfigurationRepository newRepository() {
        return new DockerRegistryConfigurationRepository(dataSource, "cryptKey");
    }

    private DockerRegistryConfigurationEntity getEntity() {
        return DockerRegistryTestUtils.generateDockerRegistryConfigurationEntity(RegistryType.GCP);
    }
}
