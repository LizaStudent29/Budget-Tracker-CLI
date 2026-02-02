import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import { TransactionType } from "../interfaces/TransactionType";
import { ITransaction } from "../interfaces/ITransaction";
import { TransactionUpdate } from "../interfaces/utility-types";

export class Transaction implements ITransaction {
  private readonly _id: string;

  get id(): string {
    return this._id;
  }

  constructor(
    public amount: number,
    public type: TransactionType,
    public date: string,
    public description: string
  ) {
    this._id = uuidv4();
  }

  update(update: TransactionUpdate): void {
    // id не трогаем, даже если его передадут
    if (update.amount !== undefined) {
      this.amount = update.amount;
    }

    if (update.type !== undefined) {
      this.type = update.type;
    }

    if (update.date !== undefined) {
      this.date = update.date;
    }

    if (update.description !== undefined) {
      this.description = update.description;
    }
  }

  toString(): string {
    const sign = this.type === "income" ? "+" : "-";
    const formattedDate = moment(this.date).format("LL"); // человекочитаемая дата

    return `[${formattedDate}] ${sign}${this.amount} — ${this.description} (id: ${this.id})`;
  }
}

