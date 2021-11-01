package org.vontech.pogchat.topics

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.vontech.pogchat.UserContext
import org.vontech.pogchat.audit.AuditLogger
import org.vontech.pogchat.audit.AuditOperation
import org.vontech.pogchat.messages.MessageRepository
import kotlin.reflect.jvm.javaGetter

@Controller
@RequestMapping(path = ["/topics"])
class TopicController {

    @Autowired
    private val topicRepository: TopicRepository? = null

    @Autowired
    private val messageRepository: MessageRepository? = null

    @Autowired
    private val userContext: UserContext? = null

    @Autowired
    private val auditLogger: AuditLogger? = null

    @PostMapping
    @ResponseBody
    fun addNewTopic(
        @RequestBody topic: Topic
    ): Topic {
        // Attach a user to this
        val user = userContext!!.getUser()
        topic.user = user
        topicRepository!!.save(topic)
        auditLogger!!.log(AuditOperation.TOPIC_CREATE, user=user)
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
        auditLogger!!.log(AuditOperation.TOPIC_VIEW)
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

    /**
     * Obtains all topics that the authenticated user has either
     * posted or posted a message in
     */
    @GetMapping("/participant")
    @ResponseBody
    fun getTopicsUserParticipating(): Iterable<Topic?> {
        val user = userContext!!.getUser()
        val myCreatedTopics = topicRepository!!.findByUserOrderByCreatedAtDesc(user)
        val myMessagedTopics = messageRepository!!.findTopicsOfMessagesFromUser(user).sortedBy { it!!.createdAt }.reversed()
        return myMessagedTopics.union(myCreatedTopics)
    }

    @GetMapping("/startup")
    @ResponseBody
    fun getTopicsForStartup(
        @RequestParam category: String,
        @RequestParam stream: String
    ): StartupTopicsResponse {
        val user = userContext!!.getUser()
        val myCreatedTopics = topicRepository!!.findByUserOrderByCreatedAtDesc(user)
        val myMessagedTopics = messageRepository!!.findTopicsOfMessagesFromUser(user).sortedBy { it!!.createdAt }.reversed()
        val participantTopics = myMessagedTopics.union(myCreatedTopics)

        auditLogger!!.log(AuditOperation.WEB_LOADED, user=user)

        return StartupTopicsResponse(
            streamTopics = topicRepository.findAll(Topic.hasFilters(Topic(stream = stream))),
            categoryTopics = topicRepository.findAll(Topic.hasFilters(Topic(category = category))),
            popularTopics = topicRepository.findTop10ByOrderByViewCountDesc(),
            participantTopics = participantTopics
        )

    }

}

data class IncrementViewCountRequest(
    val topic_id: Long
)

data class StartupTopicsRequest(
    val category: String,
    val stream: String
)

data class StartupTopicsResponse(
    val streamTopics: Iterable<Topic?>,
    val categoryTopics: Iterable<Topic?>,
    val popularTopics: Iterable<Topic?>,
    val participantTopics: Iterable<Topic?>
)