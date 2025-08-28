import {
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

/**
 * Generic validator constraint for requiring at least one field
 */
@ValidatorConstraint({ name: "requireAtLeastOneField", async: false })
export class RequireAtLeastOneFieldConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const { fields } = args.constraints[0];
    const obj = args.object as any;

    // Check if at least one of the specified fields has a value
    return fields.some((field: string) => {
      const fieldValue = obj[field];
      return (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== "" &&
        (typeof fieldValue !== "string" || fieldValue.trim() !== "")
      );
    });
  }

  defaultMessage(args: ValidationArguments) {
    const { fields, message } = args.constraints[0];

    if (message) {
      return message;
    }

    if (fields.length === 2) {
      return `Either ${fields[0]} or ${fields[1]} must be provided`;
    } else if (fields.length > 2) {
      const lastField = fields[fields.length - 1];
      const otherFields = fields.slice(0, -1).join(", ");
      return `At least one of ${otherFields}, or ${lastField} must be provided`;
    } else {
      return `${fields[0]} must be provided`;
    }
  }
}

/**
 * Class decorator to validate that at least one of the specified fields is present
 *
 * @param fields - Array of field names that should be validated
 * @param message - Optional custom error message
 *
 */
export function RequireAtLeastOne(fields: string[], message?: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    Validate(RequireAtLeastOneFieldConstraint, [{ fields, message }])(
      constructor.prototype,
      "__requireAtLeastOne"
    );
    return constructor;
  };
}
