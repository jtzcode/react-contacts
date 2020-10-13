import React from 'react';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { IPersonState, IRecordState, PersonRecord, RecordState } from './Types';
import FormValidation from './FormValidation';
import { Database } from './Database';
import { PersonalDetailsTableBuilder } from './TableBuilder';

interface IProps {
  DefaultState: IPersonState
}

export default class PersonalDetails extends React.Component<IProps, IPersonState> {
  private defaultState: Readonly<IPersonState>;
  private canSave: boolean = false;
  private people: IPersonState[];
  private dataLayer: Database<PersonRecord>

  constructor(props: IProps) {
    super(props);
    this.defaultState = props.DefaultState;
    this.state = props.DefaultState;
    const tableBuilder: PersonalDetailsTableBuilder = new PersonalDetailsTableBuilder();
    this.dataLayer = new Database<PersonRecord>(tableBuilder.Build());
  }
  private updateBinding = (event: any) => {
    switch(event.target.id) {
      case 'firstName':
        this.setState({FirstName: event.target.value});
        break;
      case 'lastName':
        this.setState({LastName: event.target.value});
        break;
      case `addr1`:
        this.setState({ Address1: event.target.value });
        break;
      case `addr2`:
        this.setState({ Address2: event.target.value });
        break;
      case `town`:
        this.setState({ Town: event.target.value });
        break;
      case `county`:
        this.setState({ County: event.target.value });
        break;
      case `postcode`:
        this.setState({ Postcode: event.target.value });
        break;
      case `phoneNumber`:
        this.setState({ PhoneNumber: event.target.value });
        break;
      case `dateOfBirth`:
        this.setState({ DateOfBirth: event.target.value });
        break;
    }
  }
  public render() {
    let people = null;
    if (this.people) {
      const that = this;
      people = this.people.map((p) => {
        return (
          <Row key={p.PersonId}>
            <Col lg="6">
              <label>{p.FirstName} {p.LastName}</label>
            </Col>
            <Col lg="3">
              <button value={p.PersonId} color="link" onClick={that.setActive}>Edit</button>
            </Col>
            <Col lg="3">
              <button value={p.PersonId} color="link" onClick={that.delete}>Delete</button>
            </Col>
          </Row>
        )
      }, this);
    }
    return (
      <Row>
        <Col lg="8">
          <Row>
            <Col><h4 className="mb-3">Personal details</h4></Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col><label htmlFor="firstName">First name</label></Col>
                <Col><label htmlFor="lastName">Last name</label></Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col>
                  <input type="text" id="firstName" className="form-control" value={this.state.FirstName} placeholder="First name" onChange={this.updateBinding} />
                </Col>
                <Col><input type="text" id="lastName" className="form-control" value={this.state.LastName} placeholder="Last name" onChange={this.updateBinding} /></Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col><label htmlFor="addr1">Address line 1</label></Col>
          </Row>
          <Row>
            <Col><input type="text" id="addr1" className="form-control" onChange={this.updateBinding} placeholder="Address line 1" value={this.state.Address1} /></Col>
          </Row>
          <Row>
            <Col><label htmlFor="addr2">Address line 2</label></Col>
          </Row>
          <Row>
            <Col><input type="text" id="addr2" className="form-control" onChange={this.updateBinding} placeholder="Address line 2" value={this.state.Address2!}  /></Col>
          </Row>
          <Row>
            <Col><label htmlFor="town">Town</label></Col>
          </Row>
          <Row>
            <Col><input type="text" id="town" className="form-control" onChange={this.updateBinding} placeholder="Town" value={this.state.Town}  /></Col>
          </Row>
          <Row>
            <Col><label htmlFor="county">County</label></Col>
          </Row>
          <Row>
            <Col><input type="text" id="county" className="form-control" onChange={this.updateBinding} placeholder="County" value={this.state.County} /></Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col lg="3"><label htmlFor="postcode">Postal/ZipCode</label></Col>
                <Col lg="4"><label htmlFor="phoneNumber">Phone number</label></Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col lg="3"><input type="text" id="postcode" className="form-control" onChange={this.updateBinding} value={this.state.Postcode!}  /></Col>
                <Col lg="4"><input type="text" id="phoneNumber" className="form-control" onChange={this.updateBinding} value={this.state.PhoneNumber!} /></Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col><label htmlFor="dateOfBirth">Date of birth</label></Col>
          </Row>
          <Row>
            <Col><input type="date" id="dateOfBirth" onChange={this.updateBinding} value={this.state.DateOfBirth!} /></Col>
          </Row>
          <Row>
            <Col>
              <Button size="lg" color="primary" onClick={this.savePerson}>Save</Button>
            </Col>
            <Col>
              <Button size="lg" color="secondary" onClick={this.clear}>Clear</Button>
            </Col>
          </Row>
          <Row><FormValidation CurrentState = {this.state} CanSave = {this.userCanSave} /></Row>
        </Col>
        <Col>
          <Col>
            <Row>
              <Col>{people}</Col>
            </Row>
            <Row>
              <Col lg="6"><Button size="lg" color="success" onClick={this.loadPeople}>Load</Button></Col>
              <Col lg="6"><Button size="lg" color="info" onClick={this.clear}>New Person</Button></Col>
            </Row>
          </Col>
        </Col>
      </Row>
    );
  }

  private async deletePerson(person: string) {
    const foundPerson = this.people.find((element: IPersonState) => {
      return element.PersonId === person;
    });
    if (!foundPerson) {
      return;
    }

    const personState: IRecordState = new RecordState();
    personState.IsActive = false;
    const state: PersonRecord = {...foundPerson, ...personState};
    await this.dataLayer.Update(state);
    this.loadPeople();
    this.clear();
  }

  private clear = () => {
    this.setState(this.defaultState);
  }

  private delete = (e: any) => {
    const person = e.target.value;
    this.deletePerson(person);
  }

  private savePerson = () => {
    if (!this.canSave) {
      alert('Cannot save. Check the items.');
      return;
    }
    const personState: IRecordState = new RecordState();
    personState.IsActive = true;
    const state: PersonRecord = {...personState, ...this.state};

    if (state.PersonId === "") {
      state.PersonId = Date.now().toString();
      this.dataLayer.Create(state).then(() => {
        this.loadPeople();
        this.clear();
      });
    } else {
      this.dataLayer.Update(state).then(res => {
        this.loadPeople();
      })
    }
  }

  private userCanSave = (hasErrors: boolean) => {
    this.canSave = hasErrors;
  }

  private loadPeople = () => {
    this.people =  new Array<PersonRecord>();
    this.dataLayer.Read().then(people => {
      this.people = people;
      this.setState(this.state);
    });
  }

  private setActive = (e: any) => {
    const person: string = e.target.value;
    const state = this.people.find((element: IPersonState) => {
      return person === element.PersonId;
    });
    if (state) {
      this.setState(state);
    }
  }
};
