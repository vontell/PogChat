package org.vontech.pogchat.usertoken

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.ModelAndView
import org.vontech.pogchat.TwitchApi
import org.vontech.pogchat.users.User
import org.vontech.pogchat.users.UserRepository
import java.time.Instant
import java.util.*
import javax.servlet.http.HttpServletResponse

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

        // Save the information within our DB. First, figure out if this user exists
        val user: User = userRepository?.findByUsername(userInfo.login) ?: User(
            username=userInfo.login,
            lastKnownDisplayName=userInfo.display_name).apply {
            userRepository?.save(this) ?: throw Exception("Unable to create user")
        }
        // Now save the new accessToken. First, delete any existing access tokens
        userTokenRepository?.deleteByUserId(user.id)
        val newToken = UserToken(
            user=user,
            pogAccessToken=state,
            accessToken=accessTokenResponse.access_token,
            refreshToken=accessTokenResponse.refresh_token,
            expiration=Date(
                Instant.now().plusSeconds(accessTokenResponse.expires_in).toEpochMilli())
        )
        userTokenRepository?.save(newToken) ?: throw Exception("Unable to save access token")

//        val extension = "chrome-extension://eljdflajgnpmenefoohehbhpcdkoiefn/options.html" +
//                "?access_token=$state"
//        httpServletResponse.status = 302
//        httpServletResponse.setHeader("Location", extension)

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
            token=userToken.pogAccessToken
        )
    }

}

