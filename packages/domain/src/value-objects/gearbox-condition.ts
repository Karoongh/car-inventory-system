export type GearboxConditionType =
  | 'HEALTHY_AND_SEALED'  // سالم و پلمپ
  | 'RECENTLY_REPAIRED'   // تازه تعمیر
  | 'NEEDS_REPAIR';       // نیاز به تعمیر

export interface GearboxConditionProps {
  type: GearboxConditionType;
  description?: string;
}

export class GearboxCondition {
  readonly type: GearboxConditionType;
  readonly description?: string;

  private constructor(props: GearboxConditionProps) {
    this.type = props.type;
    this.description = props.description;
  }

  static create(props: GearboxConditionProps): GearboxCondition {
    return new GearboxCondition(props);
  }

  toPlain() {
    return {
      type: this.type,
      description: this.description,
    };
  }
}
