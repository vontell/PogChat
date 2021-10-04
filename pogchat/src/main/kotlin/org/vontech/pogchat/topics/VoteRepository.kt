package org.vontech.pogchat.topics

import org.springframework.data.repository.CrudRepository
import org.vontech.pogchat.topics.Vote

interface VoteRepository: CrudRepository<Vote?, Long?> {



}