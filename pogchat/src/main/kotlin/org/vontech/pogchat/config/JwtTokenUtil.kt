package org.vontech.pogchat.config

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*
import java.util.function.Function
import kotlin.collections.HashMap


@Component
class JwtTokenUtil {

    companion object {
        private val serialVersionUID = -2550185165626007488L
        private val JWT_TOKEN_VALIDITY = (30* 24 * 60 * 60).toLong()
    }

    @Value("\${jwt.secret}")
    private val secret: String? = null

    // retrieve username from jwt token
    fun getUsernameFromToken(token: String?): String {
        return getClaimFromToken(token, Claims::getSubject)
    }

    // retrieve expiration date from jwt token
    fun getExpirationDateFromToken(token: String?): Date {
        return getClaimFromToken(token, Claims::getExpiration)
    }

    fun <T> getClaimFromToken(token: String?, claimsResolver: Function<Claims, T>): T {
        val claims = getAllClaimsFromToken(token)
        return claimsResolver.apply(claims)
    }

    // for retrieving any information from token we will need the secret key
    fun getAllClaimsFromToken(token: String?): Claims {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).body
    }

    //check if the token has expired
    fun isTokenExpired(token: String?): Boolean {
        val expiration: Date = getExpirationDateFromToken(token)
        return expiration.before(Date())
    }

    //generate token for user
    fun generateToken(username: String): String? {
        val claims: Map<String, Any> = HashMap()
        return doGenerateToken(claims, username)
    }

    // while creating the token -
    // 1. Define  claims of the token, like Issuer, Expiration, Subject, and the ID
    // 2. Sign the JWT using the HS512 algorithm and secret key.
    // 3. According to JWS Compact Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
    //   compaction of the JWT to a URL-safe string
    fun doGenerateToken(claims: Map<String, Any>, subject: String): String? {
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
            .signWith(SignatureAlgorithm.HS512, secret).compact()
    }

    // validate token
    fun validateToken(token: String?, userDetails: UserDetails): Boolean {
        val username = getUsernameFromToken(token)
        return username == userDetails.username && !isTokenExpired(token)
    }

}