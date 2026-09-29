export type UserRole = 'Owner' | 'Admin';

export interface UserProps {
  id?: string;
  mobile: string;
  fullName?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  readonly id?: string;
  readonly mobile: string;
  readonly fullName: string | null;
  readonly role: UserRole;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.mobile = props.mobile;
    this.fullName = props.fullName ?? null;
    this.role = props.role;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: UserProps): User {
    if (!/^09\d{9}$/.test(props.mobile)) {
      throw new Error('شماره موبایل نامعتبر است');
    }
    return new User(props);
  }
}
