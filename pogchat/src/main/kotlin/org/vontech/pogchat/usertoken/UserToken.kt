package org.vontech.pogchat.usertoken

import org.hibernate.Hibernate
import org.vontech.pogchat.users.User
import java.util.*
import javax.persistence.*
import javax.validation.constraints.NotBlank

@Entity
data class UserToken(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    val user: User? = null,

    @get: NotBlank
    val pogAccessToken: String? = null,

    @get: NotBlank
    val accessToken: String? = null,

    @get: NotBlank
    val refreshToken: String? = null,

    @Temporal(TemporalType.TIMESTAMP)
    val expiration: Date = Date()

    ) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as User

        return id == other.id
    }

    override fun hashCode(): Int = 0

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id )"
    }
}