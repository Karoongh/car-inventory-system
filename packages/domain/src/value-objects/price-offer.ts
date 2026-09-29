export type PriceOfferType =
  | 'CASH_ONLY'           // فقط نقدی
  | 'EXCHANGEABLE'        // قابل معاوضه
  | 'INSTALLMENT';        // شرایطی (با چک و غیره)

export interface PriceOfferProps {
  amount: number;                 // قیمت پیشنهادی به تومان
  type: PriceOfferType;
  exchangeDetails?: string;       // جزئیات معاوضه
  installmentDetails?: string;    // جزئیات شرایطی
}

export class PriceOffer {
  readonly amount: number;
  readonly type: PriceOfferType;
  readonly exchangeDetails?: string;
  readonly installmentDetails?: string;

  private constructor(props: PriceOfferProps) {
    this.amount = props.amount;
    this.type = props.type;
    this.exchangeDetails = props.exchangeDetails;
    this.installmentDetails = props.installmentDetails;
  }

  static create(props: PriceOfferProps): PriceOffer {
    if (props.amount <= 0) {
      throw new Error('قیمت باید بزرگ‌تر از صفر باشد');
    }
    if (props.type === 'EXCHANGEABLE' && !props.exchangeDetails) {
      throw new Error('برای معاوضه باید جزئیات مشخص شود');
    }
    if (props.type === 'INSTALLMENT' && !props.installmentDetails) {
      throw new Error('برای فروش شرایطی باید جزئیات مشخص شود');
    }
    return new PriceOffer(props);
  }

  toPlain() {
    return {
      amount: this.amount,
      type: this.type,
      exchangeDetails: this.exchangeDetails,
      installmentDetails: this.installmentDetails,
    };
  }
}
