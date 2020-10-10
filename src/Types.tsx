export type StringOrNull = string | null;
export interface IPersonState {  
    FirstName: string,  
    LastName: string,  
    Address1: string,  
    Address2: StringOrNull,  
    Town: string,  
    County: string,  
    PhoneNumber: StringOrNull;  
    Postcode: StringOrNull,  
    DateOfBirth: StringOrNull,  
    PersonId : string
}
export interface IValidator<T> {
    IsValid(input: T): boolean;
}

export interface IValidation {
    Validate(state: IPersonState, errors: string[]): void;
}