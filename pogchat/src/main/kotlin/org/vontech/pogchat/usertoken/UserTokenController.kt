package org.vontech.pogchat.usertoken

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.springframework.web.util.UriComponentsBuilder

@Controller
@RequestMapping("/auth")
class UserTokenController {

    @Autowired
    private val userTokenRepository: UserTokenRepository? = null

    @GetMapping
    @ResponseBody
    fun receiveTwitchToken(
        @RequestParam code: String,
        @RequestParam scope: String,
        @RequestParam state: String
    ): String {
        println(code)
        println(scope)
        println(state)
        return "Nice"
    }

}