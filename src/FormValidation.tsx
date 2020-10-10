import React from 'react';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { IPersonState, IValidation } from './Types';
import { AddressValidation, PersonValidation, PhoneValidation } from './Validators';

interface IValidationProps {
    CurrentState: IPersonState;
    CanSave: (canSave: boolean) => void;
}
export default class FormValidation extends React.Component<IValidationProps> {
    private failures: string[];
    private validation: IValidation[];
    private readonly errorStyles = {
        color: "red"
    }

    constructor(props: IValidationProps) {
        super(props);
        this.validation = new Array<IValidation>();
        this.validation.push(new PersonValidation());
        this.validation.push(new PhoneValidation());
        this.validation.push(new AddressValidation());

        this.failures = new Array<string>();
    }

    private Validate() {
        this.failures = new Array<string>();
        this.validation.forEach(val => {
            val.Validate(this.props.CurrentState, this.failures);
        });

        this.props.CanSave(this.failures.length === 0);
    }

    public render() {
        this.Validate();
        const errors =  this.failures.map((failure) => {
            return (<Row key = {failure}><Col><label style={this.errorStyles}>{failure}</label></Col></Row>);
        });
        return (<Col>{errors}</Col>);
    }
}