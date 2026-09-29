export interface OwnerContactProps {
  fullName: string;
  mobile: string;           // شماره موبایل به صورت 09xxxxxxxxx
  isPhoneVisible: boolean;  // مالک می‌تواند مخفی کند
}

export class OwnerContact {
  readonly fullName: string;
  readonly mobile: string;
  readonly isPhoneVisible: boolean;

  private constructor(props: OwnerContactProps) {
    this.fullName = props.fullName.trim();
    this.mobile = props.mobile;
    this.isPhoneVisible = props.isPhoneVisible;
  }

  static create(props: OwnerContactProps): OwnerContact {
    if (!props.fullName || props.fullName.trim().length < 3) {
      throw new Error('نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد');
    }
    if (!/^09\d{9}$/.test(props.mobile)) {
      throw new Error('شماره موبایل باید به فرمت 09xxxxxxxxx باشد');
    }
    return new OwnerContact(props);
  }

  hidePhone(): OwnerContact {
    return new OwnerContact({
      fullName: this.fullName,
      mobile: this.mobile,
      isPhoneVisible: false,
    });
  }

  showPhone(): OwnerContact {
    return new OwnerContact({
      fullName: this.fullName,
      mobile: this.mobile,
      isPhoneVisible: true,
    });
  }

  toPlain() {
    return {
      fullName: this.fullName,
      mobile: this.mobile,
      isPhoneVisible: this.isPhoneVisible,
    };
  }
}
