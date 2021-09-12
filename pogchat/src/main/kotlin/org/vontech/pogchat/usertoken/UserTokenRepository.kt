package org.vontech.pogchat.usertoken

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.transaction.annotation.Transactional
import org.vontech.pogchat.users.User

interface UserTokenRepository : CrudRepository<UserToken?, Int?> {
    @Transactional
    fun deleteByUserId(userId: Long)
    fun findByPogAccessToken(pogAccessToken: String): UserToken?
}