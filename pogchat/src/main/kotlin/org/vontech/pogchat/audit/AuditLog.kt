package org.vontech.pogchat.audit

import org.vontech.pogchat.users.User
import java.util.*
import javax.persistence.*
import javax.validation.constraints.NotBlank

@Entity
data class AuditLog (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    var user: User? = null,

    @get: NotBlank
    val operation: String = "",

    val message: String? = "",

    @Temporal(TemporalType.TIMESTAMP)
    val createdAt: Date = Date()
)