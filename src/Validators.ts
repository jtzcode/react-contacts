import { IValidator, StringOrNull, IValidation, IPersonState } from "./Types";

export class MinLenValidator implements IValidator<StringOrNull> {
    private minLen: number;
    constructor(minLen: number) {
        this.minLen = minLen;
    }

    public IsValid(input: StringOrNull): boolean {
        if (!input) {
            return false;
        }
        return input.length >= this.minLen;
    }
}

export class ReValidator implements IValidator<StringOrNull> {
    private regex: RegExp;
    constructor(expression: string) {
        this.regex = new RegExp(expression);
    }

    public IsValid(input: StringOrNull): boolean {
        if (!input) {
            return false;
        }
        return this.regex.test(input);
    }
}

export class AddressValidation implements IValidation {
    private minLenValidator: MinLenValidator = new MinLenValidator(5);
    private zipCodeValidator: ReValidator = new ReValidator("^[0-9]{5}(?:-[0-9]{4})?$");

    public Validate(state: IPersonState, errors: string[]): void {
        if (!this.minLenValidator.IsValid(state.Address1)) {
            errors.push("Address1 must be greater than 5 characters");
        }
        if (!this.minLenValidator.IsValid(state.Town)) {
            errors.push("Town must be greater than 5 characters");
        }
        if (!this.minLenValidator.IsValid(state.County)) {
            errors.push("County must be greater than 5 characters");
        }
        if (!this.zipCodeValidator.IsValid(state.Postcode)) {
            errors.push("Invalid zip code");
        }
    }
}

export class PersonValidation implements IValidation {
    private firstNameValidator: MinLenValidator = new MinLenValidator(1);
    private lastNameValidator: MinLenValidator = new MinLenValidator(2);

    public Validate(state: IPersonState, errors: string[]): void {
        if (!this.firstNameValidator.IsValid(state.FirstName)) {
            errors.push("First name must be greater than 5 characters");
        }
        if (!this.lastNameValidator.IsValid(state.LastName)) {
            errors.push("Last name must be greater than 5 characters");
        }
    }
}

export class PhoneValidation implements IValidation {
    private readonly phoneValidator: ReValidator = new ReValidator("^(?:\\((?:[0-9]{3})\\)|(?:[0-9]{3}))[-.]?(?:[0-9]{3})[-.]?(?:[0-9]{4})$");
    private readonly minLenValidator: MinLenValidator = new MinLenValidator(1);

    public Validate(state: IPersonState, errors: string[]): void {
        if (!this.phoneValidator.IsValid(state.PhoneNumber)) {
            errors.push("The phone number format is invalid");
        }
        if (!this.minLenValidator.IsValid(state.PhoneNumber)) {
            errors.push("You must enter a phone number");
        }
    }
}