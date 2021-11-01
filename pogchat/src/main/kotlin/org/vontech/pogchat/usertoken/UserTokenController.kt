package org.vontech.pogchat.usertoken

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.vontech.pogchat.TwitchApi
import org.vontech.pogchat.audit.AuditLogger
import org.vontech.pogchat.audit.AuditOperation
import org.vontech.pogchat.config.JwtTokenUtil
import org.vontech.pogchat.config.JwtUserDetailsService
import org.vontech.pogchat.users.User
import org.vontech.pogchat.users.UserRepository
import java.time.Instant
import java.util.*


data class LoggedInPollingResponse (
    val ready: Boolean,
    val user: User? = null,
    val token: String? = null
)

data class LoggedInPollingRequest (val accessToken: String)

@Controller
@RequestMapping("/auth")
class UserTokenController {

    @Autowired
    private val userTokenRepository: UserTokenRepository? = null

    @Autowired
    private val userRepository: UserRepository? = null;

    @Autowired
    private val jwtTokenUtil: JwtTokenUtil? = null

    @Autowired
    private val userDetailsService: JwtUserDetailsService? = null

    @Autowired
    private val auditLogger: AuditLogger? = null

    @GetMapping
    fun receiveTwitchToken(
        @RequestParam code: String,
        @RequestParam scope: String,
        @RequestParam state: String
    ): String {

        // Upon receiving a code request from Twitch, we need to
        // ask twitch for the access token
        val accessTokenResponse = TwitchApi.postAuthCodeForAccessToken(code) ?: throw Exception("Could not authorize")

        // Get the username for this user
        val userInfo = TwitchApi.getUserInformation(accessTokenResponse.access_token) ?: throw Exception("Could not authorize")

        // We skip AuthenticationManager authentication because that is done by Twitch in our case

        // Save the information within our DB. First, figure out if this user exists
        val user: User = userRepository?.findByUsername(userInfo.login) ?: User(
            username=userInfo.login,
            lastKnownDisplayName=userInfo.display_name).apply {
            userRepository?.save(this) ?: throw Exception("Unable to create user")
        }
        val jwtToken = jwtTokenUtil?.generateToken(user.username) ?: throw Exception("Unable to create user")
        // Now save the new accessToken. First, delete any existing access tokens
        userTokenRepository?.deleteByUserId(user.id)
        val newToken = UserToken(
            user=user,
            pogAccessToken=state,
            accessToken=accessTokenResponse.access_token,
            refreshToken=accessTokenResponse.refresh_token,
            jwt=jwtToken
        )
        userTokenRepository?.save(newToken) ?: throw Exception("Unable to save access token")

        auditLogger!!.log(AuditOperation.USER_LOGIN, user=user)
        return "auth_success.html"
    }

    @PostMapping
    @ResponseBody
    fun pollForLoginReady(
        @RequestBody request: LoggedInPollingRequest
    ): LoggedInPollingResponse {
        val userToken = userTokenRepository?.findByPogAccessToken(request.accessToken) ?: return LoggedInPollingResponse(ready=false)
        return LoggedInPollingResponse(
            ready=true,
            user=userToken.user,
            token=userToken.jwt
        )
    }

}

