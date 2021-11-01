package org.vontech.pogchat.audit

import org.springframework.data.repository.CrudRepository
import org.springframework.scheduling.annotation.Async
import java.util.concurrent.Future

interface AuditLogRepository: CrudRepository<AuditLog?, Long?> {

    @Async
    override fun <S : AuditLog?> save(entity: S): S

}