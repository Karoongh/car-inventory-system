export type ChassisConditionType =
  | 'HEALTHY_AND_SEALED'    // سالم و پلمپ
  | 'IMPACTED';             // ضربه خورده

export type ChassisImpactArea =
  | 'FRONT'
  | 'REAR'
  | 'LEFT'
  | 'RIGHT'
  | 'UNDERBODY'
  | 'OTHER';

export interface ChassisConditionProps {
  type: ChassisConditionType;
  impactAreas?: ChassisImpactArea[];
  description?: string;
}

export class ChassisCondition {
  readonly type: ChassisConditionType;
  readonly impactAreas: readonly ChassisImpactArea[];
  readonly description?: string;

  private constructor(props: ChassisConditionProps) {
    this.type = props.type;
    this.impactAreas = Object.freeze([...(props.impactAreas ?? [])]);
    this.description = props.description;
  }

  static create(props: ChassisConditionProps): ChassisCondition {
    if (props.type === 'IMPACTED' && (!props.impactAreas || props.impactAreas.length === 0)) {
      throw new Error('برای شاسی ضربه‌خورده باید محل ضربه مشخص شود');
    }
    return new ChassisCondition(props);
  }

  toPlain() {
    return {
      type: this.type,
      impactAreas: [...this.impactAreas],
      description: this.description,
    };
  }
}
