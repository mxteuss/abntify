package mxteuss.java.repository;

import mxteuss.java.model.PdfHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PdfHistoryRepository extends JpaRepository<PdfHistory, UUID> {
}
