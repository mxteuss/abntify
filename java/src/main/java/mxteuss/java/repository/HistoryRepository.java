package mxteuss.java.repository;


import mxteuss.java.model.ArchiveHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository

public interface HistoryRepository extends JpaRepository<ArchiveHistory, UUID> {

    List<ArchiveHistory> findBySessionId (String sessionId);
}
