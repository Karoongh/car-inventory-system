export type EngineConditionType =
  | 'HEALTHY_AND_SEALED'  // سالم و پلمپ
  | 'RECENTLY_REPAIRED'   // تازه تعمیر
  | 'NEEDS_REPAIR';       // نیاز به تعمیر

export interface EngineConditionProps {
  type: EngineConditionType;
  description?: string;
}

export class EngineCondition {
  readonly type: EngineConditionType;
  readonly description?: string;

  private constructor(props: EngineConditionProps) {
    this.type = props.type;
    this.description = props.description;
  }

  static create(props: EngineConditionProps): EngineCondition {
    return new EngineCondition(props);
  }

  toPlain() {
    return {
      type: this.type,
      description: this.description,
    };
  }
}
