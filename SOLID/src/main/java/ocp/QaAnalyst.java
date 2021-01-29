package ocp;

import java.util.Arrays;
import java.util.List;

public class QaAnalyst extends Employee {
    List<String> getResponsibilities() {
        return Arrays.asList("write test plan", "execute test plan");
    }
}
