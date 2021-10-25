package org.vontech.pogchat.topics

import org.hibernate.Hibernate
import org.springframework.data.jpa.domain.Specification
import org.springframework.data.jpa.domain.Specification.where
import org.vontech.pogchat.users.User
import java.util.*
import javax.persistence.*
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root
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

    var viewCount: Int = 0,

    @Temporal(TemporalType.TIMESTAMP)
    val createdAt: Date = Date(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    var user: User? = null

) {

    companion object {

        fun hasFilters(topic: Topic?): Specification<Topic> {
            if (topic == null) {
                return Specification<Topic> { root, query, builder ->
                    null
                }
            }
            return where(isCategory(topic.category))
                .and(isStream(topic.stream))
        }

        fun isCategory(category: String?): Specification<Topic> {
            return Specification<Topic> { root, query, builder ->
                if (!category.isNullOrEmpty()) {
                    println("CAT IS NOT NULL")
                    builder.like(builder.lower(root.get(Topic_.category)), "%${category.toLowerCase()}%")
                } else {
                    null
                }

            }
        }

        fun isStream(stream: String?): Specification<Topic> {
            return Specification<Topic> { root, query, builder ->
                if (!stream.isNullOrEmpty()) {
                    println("STREAM IS NOT NULL")
                    builder.equal(builder.lower(root.get(Topic_.stream)), stream.toLowerCase())
                } else {
                    null
                }
            }
        }

    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as Topic

        return id == other.id
    }

    override fun hashCode(): Int = 0

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id )"
    }
}