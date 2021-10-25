package org.vontech.pogchat.messages

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.vontech.pogchat.topics.Topic
import org.vontech.pogchat.users.User

interface MessageRepository : CrudRepository<Message?, Int?> {
    fun findByTopicId(topic_id: Long?): Iterable<Message?>

    @Query("SELECT DISTINCT m.topic FROM Message m WHERE m.user = :user")
    fun findTopicsOfMessagesFromUser(user: User?): Iterable<Topic?>

}