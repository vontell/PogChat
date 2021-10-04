package org.vontech.pogchat.topics

import org.vontech.pogchat.users.User
import javax.persistence.*

/**
 * Represents an upvote or downvote on a topic
 */
data class Vote (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val isUp: Boolean? = true,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="topic_id")
    var topic: Topic? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    var user: User? = null,

)