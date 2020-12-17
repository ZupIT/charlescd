package io.charlescd.villager.persistence;

import org.jooq.*;
import org.jooq.impl.DSL;
import org.jooq.tools.jdbc.MockDataProvider;
import org.jooq.tools.jdbc.MockExecuteContext;
import org.jooq.tools.jdbc.MockResult;

public class PostgresProvider implements MockDataProvider {

    @Override
    public MockResult[] execute(MockExecuteContext ctx) {
        //TODO Refactor
        Field<String> FIELD_ID = DSL.field("id)", String.class);
        DSLContext create = DSL.using(SQLDialect.POSTGRES);
        MockResult[] mock = new MockResult[1];
        Result<Record1<String>> result = create.newResult(FIELD_ID);
        result.add(create
                .newRecord(FIELD_ID)
                .values("1a3d413d-2255-4a1b-94ba-82e7366e4342"));
        mock[0] = new MockResult(1, result);
        return mock;
    }
}