package org.vontech.pogchat.topics

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.vontech.pogchat.UserContext
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root

@Controller
@RequestMapping(path = ["/topics"])
class TopicController {

    @Autowired
    private val topicRepository: TopicRepository? = null

    @Autowired
    private val userContext: UserContext? = null

    @PostMapping
    @ResponseBody
    fun addNewTopic(
        @RequestBody topic: Topic
    ): Topic {
        // Attach a user to this
        val user = userContext!!.getUser()
        topic.user = user
        topicRepository!!.save(topic)
        return topic
    }

    @ResponseBody
    @GetMapping("/categories")
    fun getAllCategories(): Iterable<String> {
        return topicRepository!!.findByDistinctCategory()
    }

    @ResponseBody
    @GetMapping
    fun allTopics(
        @RequestParam category: String?,
        @RequestParam stream: String?
    ): Iterable<Topic?> {
        val topic = Topic(stream = stream, category = category)
        return topicRepository!!.findAll(Topic.hasFilters(topic))
    }

}