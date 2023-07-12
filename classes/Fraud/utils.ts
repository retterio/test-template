import { CheckFraudInput, FraudLimit, FraudSummary } from 'utils/commonSchemas'
import Errors, { CustomError } from 'utils/custom-error'
import { differenceInHours } from 'date-fns'

export function checkFraud(orders: FraudSummary[], check: CheckFraudInput, fraudLimits: FraudLimit) {
  const now = new Date()

  const daily = orders.filter((order: FraudSummary) => differenceInHours(now, new Date(order.createdAt)) < 24)
  if (daily.length >= fraudLimits.orderLimit.day) {
    throw new CustomError({ error: Errors.Fraud[5029] })
  }
  if (daily.reduce((sum, index) => sum + index.totalPrice.priceAfterPromotions, 0) + check.totalPrice.priceAfterPromotions > fraudLimits.totalPaymentLimit.day) {
    throw new CustomError({ error: Errors.Fraud[5030] })
  }

  const weekly = orders.filter((order: FraudSummary) => differenceInHours(now, new Date(order.createdAt)) < 168)
  if (weekly.length >= fraudLimits.orderLimit.week) {
    throw new CustomError({ error: Errors.Fraud[5031] })
  }
  if (weekly.reduce((sum, index) => sum + index.totalPrice.priceAfterPromotions, 0) + check.totalPrice.priceAfterPromotions > fraudLimits.totalPaymentLimit.week) {
    throw new CustomError({ error: Errors.Fraud[5032] })
  }

  const mounthly = orders.filter((order: FraudSummary) => differenceInHours(now, new Date(order.createdAt)) < 720)
  if (mounthly.length >= fraudLimits.orderLimit.mounth) {
    throw new CustomError({ error: Errors.Fraud[5033] })
  }
  if (mounthly.reduce((sum, index) => sum + index.totalPrice.priceAfterPromotions, 0) + check.totalPrice.priceAfterPromotions > fraudLimits.totalPaymentLimit.mounth) {
    throw new CustomError({ error: Errors.Fraud[5034] })
  }
}
