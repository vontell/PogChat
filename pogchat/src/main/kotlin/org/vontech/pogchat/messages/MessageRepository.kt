package org.vontech.pogchat.messages

import org.springframework.data.repository.CrudRepository

interface MessageRepository : CrudRepository<Message?, Int?> {
    fun findByTopicId(topic_id: Long?): Iterable<Message?>
}