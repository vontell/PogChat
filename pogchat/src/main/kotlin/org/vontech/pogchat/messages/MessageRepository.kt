package org.vontech.pogchat.messages

import org.springframework.data.repository.CrudRepository

interface MessageRepository : CrudRepository<Message?, Int?>