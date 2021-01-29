package lsp;

public class FullTime extends Employee implements Vacationable {
    public void requestPaidVacations() {
        System.out.println("Requesting vacation.");
    }
}
