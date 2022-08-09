import { RequestWithUser } from '@/interfaces/auth.interface';
import PaymentsService from '@/services/payments.service';
import ResponseWrapper from '@/utils/responseWrapper';
import { NextFunction, Response } from 'express';

class PaymentsController {
  public paymentsService = new PaymentsService();

  public addOrder = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const addOrder = await this.paymentsService.addNewOrder(req)
      ResponseWrapper(req, res, {data: addOrder})
    } catch (error) {
      next(error);
    }
  };
  
  public getOrder = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const getOrder = await this.paymentsService.getOrder(req)
      ResponseWrapper(req, res, {data: getOrder})
    } catch (error) {
      next(error);
    }
  };

  public getSuccessOrder = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const getSuccessOrder = await this.paymentsService.getSuccessOrder(req)
      ResponseWrapper(req, res, {data: getSuccessOrder})
    } catch (error) {
      next(error);
    }
  };

  public getSuccessOrderCultureland = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const getSuccessOrderCultureland = await this.paymentsService.getSuccessOrderCultureland(req)
      ResponseWrapper(req, res, {data: getSuccessOrderCultureland})
    } catch (error) {
      next(error);
    }
  };

  public getPaymentsAuth = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const getPayementsAuth = await this.paymentsService.getPayementsAuth(req)
      ResponseWrapper(req, res, {data: getPayementsAuth})
    } catch (error) {
      next(error);
    }
  };

  public getPaymentsMethods = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const getPaymentsMethods = await this.paymentsService.getPaymentsMethods(req)
      ResponseWrapper(req, res, {data: getPaymentsMethods})
    } catch (error) {
      next(error);
    }
  };

  public confirmPayment = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const confirmPayment = await this.paymentsService.confirmPayment(req)
      ResponseWrapper(req, res, {data: confirmPayment})
    } catch (error) {
      next(error);
    }
  };
}

export default PaymentsController;
