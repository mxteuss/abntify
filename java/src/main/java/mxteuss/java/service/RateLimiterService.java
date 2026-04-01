package mxteuss.java.service;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import lombok.extern.slf4j.Slf4j;
import mxteuss.java.exceptions.RateLimitExceededException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Service
public class RateLimiterService {
    private final RateLimiterRegistry registry;

    public RateLimiterService(RateLimiterRegistry registry) {
        this.registry = registry;
    }

    public boolean isAllowed(String key, String profile) {
        RateLimiter limiter = getLimiter(key, profile);
        return limiter.acquirePermission();
    }


    public void checkOrThrow(String profile){
        String key = getCurrentIp();
        if(!isAllowed(key, profile)){
            throw new RateLimitExceededException(
                    "Limite excedido para: " + key
            );
        }
    }

    public RateLimiter.Metrics getMetrics(String key, String profile) {
        return getLimiter(key, profile).getMetrics();
    }

    private RateLimiter getLimiter(String key, String profile){
        String limiterName = profile + ":" + key;

        if (registry.getConfiguration(profile).isPresent()){
            return registry.rateLimiter(limiterName, profile);
        }

        return registry.rateLimiter(limiterName);

    }

    public String getCurrentIp() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attrs == null){
            throw new IllegalStateException("Nenhuma requisição HTTP ativa.");
        }
        return attrs.getRequest().getRemoteAddr();
    }
}
