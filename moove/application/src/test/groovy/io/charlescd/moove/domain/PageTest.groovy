package io.charlescd.moove.domain

import spock.lang.Specification

class PageTest extends Specification {

    def 'when evaluating if it is the last page, should do it correctly'(Page page, Boolean result) {
        expect:
        page.isLast() == result

        where:
        page                         | result
        getDummyPage([], 2, 50, 138) | true
        getDummyPage([], 3, 50, 138) | true
        getDummyPage([], 0, 50, 0)   | true
        getDummyPage([], 0, 50, 100) | false
    }

    private static Page getDummyPage(List<Circle> content, Integer pageNumber, Integer pageSize, Integer total) {
        return new Page(content, pageNumber, pageSize, total)
    }
}
