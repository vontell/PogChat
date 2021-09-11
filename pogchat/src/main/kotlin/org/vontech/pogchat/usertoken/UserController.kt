package org.vontech.pogchat.usertoken

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.util.UriComponentsBuilder

@Controller
@RequestMapping("/auth")
class UserTokenController {

    @Autowired
    private val userTokenRepository: UserTokenRepository? = null

    @GetMapping("/{uuid}")
    fun receiveTwitchToken(
        @PathVariable uuid: String,
        uriComponentsBuilder: UriComponentsBuilder
    ) {
        println(uriComponentsBuilder)
    }

}