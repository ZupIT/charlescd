package lsp;

public class Intern extends Employee implements Vacationable {
    public void requestPaidVacations() {
        System.out.println("Requesting vacation.");
    }
}
