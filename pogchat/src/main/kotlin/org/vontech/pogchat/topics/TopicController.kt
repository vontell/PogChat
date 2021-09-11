package org.vontech.pogchat.topics

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.vontech.pogchat.users.User
import org.vontech.pogchat.users.UserRepository

@Controller
@RequestMapping(path = ["/topics"])
class TopicController {

    @Autowired
    private val userRepository: UserRepository? = null

    @Autowired
    private val topicRepository: TopicRepository? = null

    @PostMapping
    @ResponseBody
    fun addNewTopic(
        @RequestBody topic: Topic,
        @RequestParam username: String
    ): Topic {
        // Attach a user to this
        val user = userRepository!!.findByUsername(username)
        topic.user = user
        topicRepository!!.save(topic)
        return topic
    }

    @ResponseBody
    @GetMapping("/categories")
    fun getAllCategories(): Iterable<String> {
        return topicRepository!!.findByDistinctCategory()
    }

    @get:ResponseBody
    @get:GetMapping
    val allTopics: Iterable<Topic?>
        get() =// This returns a JSON or XML with the users
            topicRepository!!.findAll()
}