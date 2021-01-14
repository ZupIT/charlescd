package io.charlescd.circlematcher.domain.service

import io.charlescd.circlematcher.domain.service.impl.RandomServiceImpl;
import spock.lang.Specification
import spock.lang.Unroll;

class RandomServiceImplTest extends Specification {
    private RandomService randomService;
    void setup() {
        randomService = new RandomServiceImpl();
    }
    @Unroll("test repeated #i time")
    def "should return random number in limits"() {
        when:
        def  result =  randomService.getRandomNumber(100);
        then:
        assert result >= 0 && result <= 100
        where:
        i << (1..10)
    }
}
