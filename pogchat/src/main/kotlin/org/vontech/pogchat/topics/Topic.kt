package org.vontech.pogchat.topics

import org.hibernate.Hibernate
import org.vontech.pogchat.users.User
import java.util.*
import javax.persistence.*
import javax.validation.constraints.NotBlank

@Entity
data class Topic(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val stream: String? = null,

    val category: String? = null,

    @get: NotBlank
    val title: String = "",

    val description: String? = null,

    @Temporal(TemporalType.TIMESTAMP)
    val created_at: Date = Date(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    var user: User? = null

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