package org.vontech.pogchat.topics

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.vontech.pogchat.UserContext
import kotlin.reflect.jvm.javaGetter

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

    @PostMapping("/view")
    @ResponseBody
    fun incrementViewCount(
        @RequestBody addViewRequest: IncrementViewCountRequest
    ) {
        val topic = topicRepository!!.findById(addViewRequest.topic_id).get()
        topic.viewCount += 1
        topicRepository.save(topic)
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

    @GetMapping("/popular")
    @ResponseBody
    fun getPopularTopics(): Iterable<Topic?> {
        return topicRepository!!.findTop10ByOrderByViewCountDesc()
    }

}

data class IncrementViewCountRequest(
    val topic_id: Long
)