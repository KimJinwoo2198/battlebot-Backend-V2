import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PaymentsController from '@/controllers/payments.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { confirmPayment, newPayments, PaymentsGift } from '@/dtos/payments.dto';

class PaymentsRoute implements Routes {
  public path = '/payments';
  public router = Router();
  public paymentsController = new PaymentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
   this.router.get(`${this.path}/auth`, authMiddleware, this.paymentsController.getPaymentsAuth);
   this.router.get(`${this.path}/methods`, authMiddleware, this.paymentsController.getPaymentsMethods);
   this.router.post(`${this.path}/confirm-payment`, authMiddleware, validationMiddleware(confirmPayment, 'body'), this.paymentsController.confirmPayment);
   this.router.post(`${this.path}/order`, authMiddleware, validationMiddleware(newPayments, 'body'), this.paymentsController.addOrder);
   this.router.get(`${this.path}/order/:orderId`, authMiddleware, this.paymentsController.getOrder);
   this.router.get(`${this.path}/order/success/:orderId`, authMiddleware, this.paymentsController.getSuccessOrder);
   this.router.post(`${this.path}/order/success/:orderId/gift`, authMiddleware, validationMiddleware(PaymentsGift, 'body'), this.paymentsController.getSuccessOrderCultureland);
  }
}

export default PaymentsRoute;
