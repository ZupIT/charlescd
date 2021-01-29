package srp;

public class PurchaseService {

    void sendOrder(PurchaseOrder order) {
        validateOrder(order);
        performBilling(order);
        prepareProducts(order);
        sendConfirmationMail(order);
    }

    private void validateOrder(PurchaseOrder order) { /* Validation code */ }
    private void performBilling(PurchaseOrder order) { /* Billing code */ }
    private void prepareProducts(PurchaseOrder order) { /* Product preparation code */ }
    private void sendConfirmationMail(PurchaseOrder order) { /* Mailing code */ }

}
