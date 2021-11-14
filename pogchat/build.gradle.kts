import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.jetbrains.kotlin.kapt3.base.Kapt.kapt

// https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/htmlsingle/#packaging-executable.jars

plugins {
	id("org.springframework.boot") version "2.4.10"
	id("io.spring.dependency-management") version "1.0.11.RELEASE"
	kotlin("jvm") version "1.4.32"
	kotlin("plugin.spring") version "1.4.32"
	kotlin("plugin.jpa") version "1.4.32"
	kotlin("kapt") version "1.4.32"

}

group = "org.vontech"
version = "0.0.7-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_1_8

springBoot {
	mainClass.set("org.vontech.pogchat.PogchatApplicationKt")
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("com.squareup.okhttp3:okhttp:4.9.0")
	implementation("com.squareup.moshi:moshi:1.12.0")
	implementation("com.squareup.moshi:moshi-kotlin:1.12.0")
	implementation("io.jsonwebtoken:jjwt:0.9.1")
	kapt("org.hibernate:hibernate-jpamodelgen:5.4.30.Final")
	runtimeOnly("mysql:mysql-connector-java")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	compileOnly("org.springframework.boot:spring-boot-starter-tomcat")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "1.8"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
