import React from 'react';
import logo from './logo.svg';
import './App.css';
import Container from 'reactstrap/lib/Container';
import PersonalDetails from './PersonalDetails';
import { IPersonState } from './Types';

export default class App extends React.Component {
  private defaultPerson : IPersonState = {
    Address1: "",
    Address2: null,
    County: "CN",
    DateOfBirth : new Date().toISOString().substring(0,10),
    FirstName: "tz",
    LastName: "J",
    PersonId : "",
    PhoneNumber: "",
    Postcode: "",
    Town: "NKG"
  }

  public render() {
    return (
      <Container>
        <PersonalDetails DefaultState={this.defaultPerson} />
      </Container>
    );
  }
}
