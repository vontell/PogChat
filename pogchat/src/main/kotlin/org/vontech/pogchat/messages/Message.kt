package org.vontech.pogchat.messages

import com.fasterxml.jackson.annotation.JsonIgnore
import org.vontech.pogchat.topics.Topic
import org.vontech.pogchat.users.User
import java.util.*
import javax.persistence.*
import javax.validation.constraints.NotBlank

@Entity
data class Message(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    var user: User? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="topic_id")
    @JsonIgnore
    var topic: Topic? = null,

    @get: NotBlank
    val content: String = "",

    @Temporal(TemporalType.TIMESTAMP)
    val createdAt: Date = Date()
)