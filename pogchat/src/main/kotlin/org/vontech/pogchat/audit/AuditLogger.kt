package org.vontech.pogchat.audit

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.vontech.pogchat.users.User

@Component
class AuditLogger {

    @Autowired
    val auditLogRepo: AuditLogRepository? = null

    fun log(operation: AuditOperation, message: String? = null, user: User? = null) {
        auditLogRepo!!.save(AuditLog(
            user=user,
            operation=operation.name,
            message=message
        ))
    }

}


enum class AuditOperation {
    MESSAGE_CREATE,
    USER_CHANGE_COLOR,
    USER_LOGIN,
    TOPIC_CREATE,
    TOPIC_VIEW,
    WEB_LOADED
}