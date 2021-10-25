package org.vontech.pogchat.topics

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.domain.Specification
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.vontech.pogchat.users.User

interface TopicRepository : CrudRepository<Topic?, Long?>, JpaSpecificationExecutor<Topic> {

    @Query("SELECT DISTINCT t.category FROM Topic t")
    fun findByDistinctCategory(): Iterable<String>

    fun findTop10ByOrderByViewCountDesc(): Iterable<Topic?>

    fun findAll(spec: Specification<Topic>): Iterable<Topic?>

    fun findByUserOrderByCreatedAtDesc(user: User): Iterable<Topic?>

}