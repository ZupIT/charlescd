package srp;

public class PurchaseServiceRefactored {

    private OrderValidatorService orderValidatorService;
    private BillingService billingService;
    private ProductService productService;
    private MailService mailService;

    public PurchaseServiceRefactored(OrderValidatorService orderValidatorService,
                                     BillingService billingService, ProductService productService,
                                     MailService mailService) {
        this.orderValidatorService = orderValidatorService;
        this.billingService = billingService;
        this.productService = productService;
        this.mailService = mailService;
    }

    private void sendOrder(PurchaseOrder order) {
        orderValidatorService.validateOrder(order);
        billingService.performBilling(order);
        productService;prepareProducts(order);
        mailService.sendConfirmationMail(order)
    }
}
