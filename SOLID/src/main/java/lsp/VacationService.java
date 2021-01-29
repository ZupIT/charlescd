package lsp;

public class VacationService {
    public void onVacationFormSubmitted(Vacationable vacationable) {
        vacationable.requestPaidVacations();
    }
}
