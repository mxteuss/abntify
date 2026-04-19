package mxteuss.java.repository;

import mxteuss.java.model.ArchiveModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ArchiveRepository extends JpaRepository <ArchiveModel, UUID> {
}
