package org.vontech.pogchat.config

import io.jsonwebtoken.ExpiredJwtException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


@Component
class JwtRequestFilter: OncePerRequestFilter() {

    @Autowired
    private val jwtUserDetailsService: JwtUserDetailsService? = null

    @Autowired
    private val jwtTokenUtil: JwtTokenUtil? = null
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val requestTokenHeader = request.getHeader("Authorization")
        // NOTE(vontell): Why "Pogger"? Why not "Bearer"? Because we can do whatever we want.
        // For more info on this, https://www.youtube.com/watch?v=dQw4w9WgXcQ
        var username: String? = null
        var jwtToken: String? = null
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Pogger ")) {
            jwtToken = requestTokenHeader.substring("Pogger ".length)
            try {
                username = jwtTokenUtil!!.getUsernameFromToken(jwtToken)
            } catch (e: IllegalArgumentException) {
                println("Unable to get JWT Token")
            } catch (e: ExpiredJwtException) {
                println("JWT Token has expired")
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            val userDetails = jwtUserDetailsService?.loadUserByUsername(username)
            if (userDetails != null) {
                if (jwtTokenUtil?.validateToken(jwtToken, userDetails) == true) {
                    val usernamePasswordAuthenticationToken = UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.authorities
                    )
                    usernamePasswordAuthenticationToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                    // After setting the Authentication in the context, we specify
                    // that the current user is authenticated. So it passes the
                    // Spring Security Configurations successfully.
                    // After setting the Authentication in the context, we specify
                    // that the current user is authenticated. So it passes the
                    // Spring Security Configurations successfully.
                    SecurityContextHolder.getContext().authentication = usernamePasswordAuthenticationToken
                }
            }
        }

        filterChain.doFilter(request, response);

    }

}