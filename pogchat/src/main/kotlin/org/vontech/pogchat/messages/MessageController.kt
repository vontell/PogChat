package org.vontech.pogchat.messages

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.vontech.pogchat.UserContext
import org.vontech.pogchat.topics.TopicRepository

@Controller
@RequestMapping(path = ["/messages"])
class MessageController {

    @Autowired
    private val topicRepository: TopicRepository? = null

    @Autowired
    private val messageRepository: MessageRepository? = null

    @Autowired
    private val userContext: UserContext? = null

    @PostMapping
    @ResponseBody
    fun addNewMessage(
        @RequestBody messageRequest: CreateMessageRequest
    ): Message {
        val user = userContext!!.getUser()
        val topic = topicRepository!!.findById(messageRequest.topic_id)
        val messageObj = Message(user=user, topic=topic.get(), content=messageRequest.message)
        messageRepository!!.save(messageObj)
        return messageObj
    }

    @ResponseBody
    @GetMapping
    fun getMessagesForTopic(
        @RequestParam topic_id: Long
    ): Iterable<Message?> {
        return messageRepository!!.findByTopicId(topic_id)
    }

}

data class CreateMessageRequest(
    val message: String,
    val topic_id: Long
)