export type billDetailType = {
  billDetailID: string;
  billID: string;
  itemType: "Hotel" | "Tour";
  itemID: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
  createdAt: Date;
};
