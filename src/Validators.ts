import { IValidator, StringOrNull } from "./Types";

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