export type QrType = {
  qrCode: string;
  paymentUrl: string;
  billId: string;
  amount: number;
  orderDescription: string;
  expiresAt: Date;
};

export type QrResponse = {
  message: string;
  paidAt: string;
};
