package org.vontech.pogchat.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.vontech.pogchat.usertoken.UserTokenRepository

@Service
class JwtUserDetailsService: UserDetailsService {

    @Autowired
    private val userTokenRepository: UserTokenRepository? = null

    override fun loadUserByUsername(username: String?): UserDetails {
        if (username == null) {
            throw UsernameNotFoundException("User not found with username: $username")
        }
        val token = userTokenRepository?.findByUserUsername(username)
            ?: throw UsernameNotFoundException("User not found with username: $username")
        return User(token.user!!.username, "", listOf())
    }

}