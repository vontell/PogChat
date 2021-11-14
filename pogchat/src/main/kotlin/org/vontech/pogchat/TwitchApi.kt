package org.vontech.pogchat

import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.io.IOException


fun getRedirectLink(): String {
    println("GETTING SPRING PROFILE")
    return try {
        println(System.getenv("SPRING_PROFILES_ACTIVE"))
        if (System.getenv("SPRING_PROFILES_ACTIVE").equals("prod")) {
            println("RETURNING https://pogchatgg.herokuapp.com/auth")
            "https://pogchatgg.herokuapp.com/auth"
        }
        else
            "http://localhost:8080/auth"
    } catch(e: NullPointerException) {
        "http://localhost:8080/auth"
    }
}

class TwitchApi {

    companion object {

        private val moshi: Moshi = Moshi.Builder()
            .addLast(KotlinJsonAdapterFactory())
            .build()
        private val twitchResponseJsonAdapter: JsonAdapter<TwitchAccessTokenResponse> = moshi.adapter(TwitchAccessTokenResponse::class.java)
        private val twitchUserResponseJsonAdapter: JsonAdapter<TwitchUserInformationResponse> = moshi.adapter(TwitchUserInformationResponse::class.java)

        private val redirectLink: String = getRedirectLink()

        fun postAuthCodeForAccessToken(accessCode: String): TwitchAccessTokenResponse? {
            val accessTokenRequest = "https://id.twitch.tv/oauth2/token"
            val formBody = FormBody.Builder()
                .add("client_id", "mbiftzplnzsllgon3p5gqkbke8rkyy")
                .add("client_secret", "ya1cn775vfeclxlk3jfedn4omf44ui")
                .add("code", accessCode)
                .add("grant_type", "authorization_code")
                .add("redirect_uri", redirectLink)
                .build()
            val client = OkHttpClient()
            val request = Request.Builder()
                .url(accessTokenRequest)
                .post(formBody)
                .build()
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) throw IOException("Unexpected response: $response")
                return twitchResponseJsonAdapter.fromJson(response.body!!.source())
            }
        }

        fun getUserInformation(accessToken: String): TwitchUserInformation? {
            val url = "https://api.twitch.tv/helix/users"
            val client = OkHttpClient()
            val request = Request.Builder()
                .header("Authorization", "Bearer $accessToken")
                .header("Client-ID", "mbiftzplnzsllgon3p5gqkbke8rkyy")
                .url(url)
                .get()
                .build()
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) throw IOException("Unexpected code $response")
                return twitchUserResponseJsonAdapter.fromJson(response.body!!.source())?.data?.first()
            }
        }

    }
}

data class TwitchAccessTokenResponse(
    val access_token: String,
    val refresh_token: String,
    val expires_in: Long,
    val scope: List<String>,
    val token_type: String
)

data class TwitchUserInformationResponse(
    val data: List<TwitchUserInformation>
)

data class TwitchUserInformation(
    val broadcaster_type: String,
    val description: String,
    val display_name: String,
    val id: String,
    val login: String,
    val offline_image_url: String,
    val profile_image_url: String,
    val type: String,
    val view_count: Int,
    val email: String,
    val created_at: String
)
