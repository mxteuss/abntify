package mxteuss.java;

import mxteuss.java.model.ArchiveModel;
import mxteuss.java.service.AiService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.assertThatThrownBy;



@ExtendWith(MockitoExtension.class)
public class AiTest {

    @InjectMocks
    private AiService aiService;

    @Test
    void returnOfNotFound(){
        ArchiveModel model = null;

        assertThatThrownBy(() -> aiService.traduzirResumo(model))
                .isInstanceOf(NullPointerException.class);
    }
}
