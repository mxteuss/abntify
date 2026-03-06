package mxteuss.java.repository;

import mxteuss.java.model.PdfModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PdfModelRepository extends JpaRepository <PdfModel, UUID> {
}
