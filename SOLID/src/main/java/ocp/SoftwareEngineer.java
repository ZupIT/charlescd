package ocp;

import java.util.Arrays;
import java.util.List;

public class SoftwareEngineer extends Employee {
    List<String> getResponsibilities() {
        return Arrays.asList("code", "code review");
    }
}
