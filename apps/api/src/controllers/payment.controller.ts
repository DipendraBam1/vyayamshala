import type { Request, Response } from "express";
import {
  createPayment,
  getPayments,
  updatePayment,
} from "../services/payments.service";

export async function createPaymentController(
  req: Request,
  res: Response,
) {
  try {
    const {
      membershipId,
      amount,
      paymentDate,
      method,
      transactionId,
    } = req.body;

    if (
      !membershipId ||
      !amount ||
      !paymentDate ||
      !method
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Membership, amount, payment date and method are required",
      });
    }

    const payment = await createPayment({
      membershipId: Number(membershipId),
      amount: String(amount),
      paymentDate,
      method,
      transactionId,
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create payment",
    });
  }
}
export async function getPaymentsController(
  _req: Request,
  res: Response,
) {
  try {
    const payments = await getPayments();

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
}
export async function updatePaymentController(
  req: Request,
  res: Response,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "COMPLETED",
      "PENDING",
      "FAILED",
      "REFUNDED",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Use COMPLETED, PENDING, FAILED or REFUNDED",
      });
    }

    const payment = await updatePayment(id, {
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update payment",
    });
  }
}