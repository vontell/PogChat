package org.vontech.pogchat

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PogchatApplication

fun main(args: Array<String>) {
	runApplication<PogchatApplication>(*args)
}
