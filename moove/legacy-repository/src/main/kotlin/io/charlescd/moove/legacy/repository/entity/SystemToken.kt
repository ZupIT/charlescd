package io.charlescd.moove.legacy.repository.entity

import org.hibernate.annotations.ColumnTransformer
import javax.persistence.*

@Entity
@Table(name = "system_tokens")
class SystemToken (

    @Id
    val id: String,

    @ColumnTransformer(
        read = "pgp_sym_decrypt(token::bytea, '64971923d21a4887a3acf1ad15961bbc')"
    )
    @Column(name = "token", columnDefinition = "bytea")
    val token: String

)
