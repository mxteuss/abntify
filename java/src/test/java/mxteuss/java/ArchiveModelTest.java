package mxteuss.java;


import mxteuss.java.model.ArchiveHistory;

import mxteuss.java.repository.HistoryRepository;
import mxteuss.java.service.ArchiveService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ArchiveModelTest {

    @Mock
    private HistoryRepository historyRepository;

    @InjectMocks
    private ArchiveService archiveService;

    @Test
    void shouldFindArchiveById() {

        ArchiveHistory history = new ArchiveHistory();
        UUID random = UUID.randomUUID();
        when(historyRepository.findById(random))
                .thenReturn(Optional.of(history));

        ArchiveHistory result = archiveService.buscarId(random);

        assertThat(result).isEqualTo(history);
        verify(historyRepository).findById(random);
    }

    @Test
    void returnOfNotFound(){
        UUID random = UUID.randomUUID();

        when(historyRepository.findById(random))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> archiveService.buscarId(random))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Pdf Inválido");
    }
}

