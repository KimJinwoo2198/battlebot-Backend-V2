import ResponseWrapper from "@/utils/responseWrapper";
import rateLimit from "express-rate-limit"

export const limiter  = rateLimit({
	windowMs: 60 * 1000,
	max: 250,
	statusCode: 429,
    keyGenerator: (req) => req.headers['x-forwarded-for'] as string,
	handler(req, res) {
		ResponseWrapper(req, res, {
            message: req.t("limite"),
            status: 429
        })
	}
});

export const verifyPhoneRateLimit = rateLimit({
	windowMs: 60 * 1000 * 30,
	max: 3,
	statusCode: 429,
    keyGenerator: (req) => req.headers['x-forwarded-for'] as string,
	handler(req, res) {
		ResponseWrapper(req, res, {
            message: req.t("limitePhoneVerify"),
            status: 429
        })
	}
});