import React from 'react';
import FetchApi from '../../helpers/FetchApi';
import './index.css';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Collapse, NavbarToggler, Nav, NavItem, NavLink, Container, Row, Col, Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { Redirect } from 'react-router';

class AuthRoute extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loggedIn: false,
    }
  }

  async login(evt) {
    evt.preventDefault();
    try {
      const response = await FetchApi.post('/api/auth/login', {user: {userName: this.state.username, password: this.state.password}});
      if (response.data.success) {
        FetchApi.setToken(response.data.token);
        this.setState({loggedIn: true});
      } else {
        this.setState({message: response.data.message});
      }
    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <section id="auth">
        <Container>
          <h1>
            Login
          </h1>
          <Form onSubmit={(evt) => this.login(evt)}>
            <FormGroup row>
              <Label for="username" sm={2}>Username</Label>
              <Col sm={10}>
                <Input type="text" name="username" id="username" placeholder="Username" onChange={(evt) => this.setState({username: evt.target.value})} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="password" sm={2}>Password</Label>
              <Col sm={10}>
                <Input type="password" name="password" id="password" placeholder="Password" onChange={(evt) => this.setState({password: evt.target.value})} />
              </Col>
            </FormGroup>
            <FormGroup check row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button>Submit</Button>
              </Col>
            </FormGroup>
          </Form>
          <Row>
            <Col>
              <span style={{color: 'red'}}>
                {this.state.message}
              </span>
            </Col>
          </Row>
        </Container>
        {this.state.loggedIn ? <Redirect to="/admin"/> : null}
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    
  };
}

export default connect(mapStateToProps)(AuthRoute);