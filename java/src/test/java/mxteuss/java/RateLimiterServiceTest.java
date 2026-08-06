package mxteuss.java;

import mxteuss.java.service.RateLimiterService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
public class RateLimiterServiceTest {

    @InjectMocks
    private RateLimiterService rateLimiterService;

    @Test
    void shouldThrownAnErrorWhenIpIsNull(){
        assertThatThrownBy(() -> rateLimiterService.getCurrentIp()).isInstanceOf(IllegalStateException.class);
    }
}
