package org.vontech.pogchat.controllers

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.vontech.pogchat.users.User
import org.vontech.pogchat.users.UserRepository


@Controller
@RequestMapping(path = ["/demo"])
class MainController {
    @Autowired
    private val userRepository: UserRepository? = null

    @PostMapping(path = ["/add"]) // Map ONLY POST Requests
    @ResponseBody
    fun addNewUser(
        @RequestParam username: String
    ): String {
        val n = User(username=username)
        userRepository!!.save(n)
        return "Saved"
    }

    // This returns a JSON or XML with the users
    @get:ResponseBody
    @get:GetMapping(path = ["/all"])
    val allUsers: Iterable<User?>
        get() =// This returns a JSON or XML with the users
            userRepository!!.findAll()
}