package ocp;

import java.util.Arrays;
import java.util.List;

public class EmployeeManagerService {

    public List<String> getEmployeeResponsibilities(Employee employee) {
        if (employee.getEmployeeRole() == EmployeeRole.DEV) {
            return Arrays.asList("code", "code review");
        }

        else if (employee.getEmployeeRole() == EmployeeRole.TEST) {
            return Arrays.asList("write test plan", "execute test plan");
        }

        else if (employee.getEmployeeRole() == EmployeeRole.UX) {
            return Arrays.asList("analyze usability");
        }

        else {
            return Arrays.asList("ERROR");
        }
    }
}
