package org.vontech.pogchat.users

import org.springframework.data.repository.CrudRepository


interface UserRepository : CrudRepository<User?, Int?> {
    fun findByUsername(username: String): User?
}