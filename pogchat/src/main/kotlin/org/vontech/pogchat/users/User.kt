package org.vontech.pogchat.users

import org.hibernate.Hibernate
import javax.persistence.*
import javax.validation.constraints.NotBlank


@Entity
@Table(
    uniqueConstraints = [UniqueConstraint(columnNames = ["username"])]
)
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @get: NotBlank
    val username: String = ""

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