package org.vontech.pogchat

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.web.client.HttpClientErrorException
import org.vontech.pogchat.users.User
import org.vontech.pogchat.users.UserRepository
import org.vontech.pogchat.usertoken.UserToken
import org.vontech.pogchat.usertoken.UserTokenRepository

@Service
class UserContext {

        @Autowired
        private val userRepository: UserRepository? = null

        @Autowired
        private val userTokenRepository: UserTokenRepository? = null

        fun getUser(): User {
            val userPrincipal = SecurityContextHolder.getContext().authentication.principal
                    as org.springframework.security.core.userdetails.User
            val username = userPrincipal.username
            return userRepository?.findByUsername(username) ?: throw Exception("User account error - please try again")
        }

        fun getUserToken(): UserToken {
            val userPrincipal = SecurityContextHolder.getContext().authentication.principal
                    as org.springframework.security.core.userdetails.User
            val username = userPrincipal.username
            return userTokenRepository?.findByUserUsername(username) ?: throw Exception("User account error - please try again")
        }

}