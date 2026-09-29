/**
 * Value Object: شرایط بدنه خودرو
 * تمام حالت‌های ممکن به صورت type-safe تعریف شده‌اند.
 */

export type BodyConditionType =
  | 'ZERO_KM_DRY'           // صفر کیلومتر خشک
  | 'NO_PAINT_NO_SCRATCH'   // بی‌رنگ بدون خط و خش
  | 'NO_PAINT_MINOR_SCRATCH'// بی‌رنگ با خط و خش جزئی
  | 'ONE_PART_PAINTED'      // یک قطعه رنگ
  | 'TWO_PARTS_PAINTED'     // دو قطعه رنگ
  | 'THREE_PARTS_PAINTED'   // سه قطعه رنگ
  | 'FULL_PAINT';           // دور رنگ

export type BodyPart =
  | 'HOOD'                  // کاپوت
  | 'FRONT_LEFT_FENDER'     // گلگیر جلو چپ
  | 'FRONT_RIGHT_FENDER'    // گلگیر جلو راست
  | 'REAR_LEFT_FENDER'      // گلگیر عقب چپ
  | 'REAR_RIGHT_FENDER'     // گلگیر عقب راست
  | 'FRONT_LEFT_DOOR'       // درب جلو چپ
  | 'FRONT_RIGHT_DOOR'      // درب جلو راست
  | 'REAR_LEFT_DOOR'        // درب عقب چپ
  | 'REAR_RIGHT_DOOR'       // درب عقب راست
  | 'TRUNK'                 // درب صندوق
  | 'ROOF'                  // سقف
  | 'FRONT_BUMPER'          // سپر جلو
  | 'REAR_BUMPER'           // سپر عقب
  | 'OTHER';

export interface BodyConditionProps {
  type: BodyConditionType;
  paintedParts?: BodyPart[]; // فقط وقتی type شامل رنگ باشد
  description?: string;
}

export class BodyCondition {
  readonly type: BodyConditionType;
  readonly paintedParts: readonly BodyPart[];
  readonly description?: string;

  private constructor(props: BodyConditionProps) {
    this.type = props.type;
    this.paintedParts = Object.freeze([...(props.paintedParts ?? [])]);
    this.description = props.description;
  }

  static create(props: BodyConditionProps): BodyCondition {
    if (
      ['ONE_PART_PAINTED', 'TWO_PARTS_PAINTED', 'THREE_PARTS_PAINTED', 'FULL_PAINT'].includes(
        props.type,
      ) &&
      (!props.paintedParts || props.paintedParts.length === 0)
    ) {
      throw new Error('برای شرایط رنگ‌شده باید حداقل یک قطعه مشخص شود');
    }
    return new BodyCondition(props);
  }

  toPlain() {
    return {
      type: this.type,
      paintedParts: [...this.paintedParts],
      description: this.description,
    };
  }
}
