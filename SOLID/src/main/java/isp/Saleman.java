package isp;

public class Saleman extends Employee implements Commissionable{
    private double salary;
    private int totalSales;

    public double getSalary() {
        return salary + getSalesCommission();
    }

    public double getSalesCommission() {
        return totalSales * 0.3;
    }
}
