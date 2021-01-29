package ocp;

import java.util.List;

abstract class Employee {
    private EmployeeRole employeeRole;

    abstract List<String> getResponsibilities();

    public EmployeeRole getEmployeeRole() {
        return employeeRole;
    }
}
