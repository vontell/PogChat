package org.vontech.pogchat.topics

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface TopicRepository : CrudRepository<Topic?, Int?> {
    fun getTopicsByCategory(category: String): Iterable<Topic>

    @Query("SELECT DISTINCT t.category FROM Topic t")
    fun findByDistinctCategory(): Iterable<String>

}