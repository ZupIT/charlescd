package ocp;

import java.util.Arrays;
import java.util.List;

public class EmployeeManagerServiceRefactored {

    public List<String> getEmployeeResponsibilities(Employee employee) {
        return employee.getResponsibilities();
    }
}
