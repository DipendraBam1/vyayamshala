import { db } from "../prisma/db.js";

interface CreatePaymentData {
  membershipId: number;
  amount: string;
  paymentDate: string;
  method: string;
  transactionId?: string;
}
interface UpdatePaymentData {
  amount?: string;
  paymentDate?: string;
  method?: string;
  status?: string;
  transactionId?: string;
}


export async function createPayment(data: CreatePaymentData) {
  const membership = await db.orm.public.Membership
    .where({ id: data.membershipId })
    .first();

  if (!membership) {
    throw new Error("Membership not found");
  }

  const payment = await db.orm.public.Payment.create({
    membershipId: data.membershipId,
    amount: data.amount,
    paymentDate: data.paymentDate,
    method: data.method,
    status: "COMPLETED",
    transactionId: data.transactionId,
  });

  return payment;
}
export async function getPayments() {
  return db.orm.public.Payment
    .include("membership", (membership) =>
      membership
        .include("member", (member) =>
          member.include("user", (user) =>
            user.select(
              "id",
              "name",
              "email",
            ),
          ),
        )
        .include("plan", (plan) =>
          plan.select(
            "id",
            "name",
            "duration",
            "price",
          ),
        ),
    )
    .all();
}
export async function updatePayment(
  id: number,
  data: UpdatePaymentData,
) {
  const payment = await db.orm.public.Payment
    .where({ id })
    .first();

  if (!payment) {
    throw new Error("Payment not found");
  }

  const updatedPayment = await db.orm.public.Payment
    .where({ id })
    .update({
       status: data.status,
     });

  if (!updatedPayment) {
    throw new Error("Payment not found");
  }

  return updatedPayment;
}
 