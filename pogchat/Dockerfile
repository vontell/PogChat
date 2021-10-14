
# temp container to build using gradle
FROM gradle:6.9.1-jdk8 AS TEMP_BUILD_IMAGE
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY build.gradle.kts settings.gradle.kts $APP_HOME

COPY gradle $APP_HOME/gradle
COPY --chown=gradle:gradle . /home/gradle/src
USER root
RUN chown -R gradle /home/gradle/src

RUN gradle build || return 0
COPY . .
RUN gradle clean build

# The actual container
FROM openjdk:8-jdk-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
ENV APP_HOME=/usr/app/
ENV ARTIFACT_NAME=pogchat-0.0.1-SNAPSHOT.jar

WORKDIR $APP_HOME
COPY --from=TEMP_BUILD_IMAGE $APP_HOME/build/libs/$ARTIFACT_NAME .

ENTRYPOINT ["java", "-jar", "${ARTIFACT_NAME}"]