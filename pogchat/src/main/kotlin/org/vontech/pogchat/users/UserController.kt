package org.vontech.pogchat.users

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.vontech.pogchat.UserContext

@Controller
@RequestMapping(path = ["/users"])
class UserController {

    @Autowired
    private val userRepository: UserRepository? = null

    @Autowired
    private val userContext: UserContext? = null

    @PostMapping("/color")
    @ResponseBody
    fun changeColor(
        @RequestBody colorRequest: UpdateColorRequest
    ) {
        // Attach a user to this
        val user = userContext!!.getUser()
        user.chatColor = colorRequest.color
        userRepository!!.save(user)
    }

}

data class UpdateColorRequest(
    val color: String
)