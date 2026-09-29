export type DocumentStatusType =
  | 'COMPLETE_AND_READY'  // کامل و آماده انتقال
  | 'HAS_PROBLEM';        // مشکل دارد

export interface DocumentStatusProps {
  type: DocumentStatusType;
  problemDescription?: string;
}

export class DocumentStatus {
  readonly type: DocumentStatusType;
  readonly problemDescription?: string;

  private constructor(props: DocumentStatusProps) {
    this.type = props.type;
    this.problemDescription = props.problemDescription;
  }

  static create(props: DocumentStatusProps): DocumentStatus {
    if (props.type === 'HAS_PROBLEM' && !props.problemDescription) {
      throw new Error('در صورت وجود مشکل در مدارک باید توضیحات وارد شود');
    }
    return new DocumentStatus(props);
  }

  toPlain() {
    return {
      type: this.type,
      problemDescription: this.problemDescription,
    };
  }
}
