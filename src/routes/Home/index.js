import React from 'react';
import FetchApi from '../../helpers/FetchApi';
import './index.css';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Collapse, NavbarToggler, Nav, NavItem, NavLink, Container, Row, Col } from 'reactstrap';

class HomeRoute extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selectedCollection: {},
      listings: [],
      collections: [],
      authors: [],
      author: {},
      loading: true,
    }
  }

  componentDidMount() {
    this.getListings();
    this.getCollections();
    this.getAuthors();
  }

  getListings = async (evt, selectedCollection = {}, author = {}) => {
    console.log(selectedCollection.id);
    if (evt) evt.preventDefault();
    this.setState({loading: true});
    try {
      let url = '/api/listings';
      if (selectedCollection.id) {
        url = `${url}?collectionId=${selectedCollection.id}`
      }
      if (author) {
        if(selectedCollection.id) {
          url = `${url}&authorId=${author.id}`
        } else {
          url = `${url}?authorId=${author.id}`
        }
      }

      const listings = await FetchApi.get(url);

      this.setState({listings: listings.data.data, selectedCollection, author, loading: false});
    } catch (e) {
      console.error(e);
    }
  }

  getAuthors = async () => {
    try {
      const authors = await FetchApi.get('/api/authors');
      this.setState({authors: authors.data.data});
      
    } catch (e) {
      console.error(e);
    }
  }

  getCollections = async () => {
    try {
      const collections = await FetchApi.get('/api/collections');
      this.setState({collections: collections.data.data});
    } catch (e) {
      console.error(e);
    }
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <section id="home">
        <header className="App-header">
          <Navbar light  expand="md">
            <NavbarBrand>
              Home
            </NavbarBrand>
            <NavbarToggler onClick={() => this.toggle()} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav>
                {/*
                  <NavItem>
                    <Link className="nav-link" to="/">Collections</Link>
                  </NavItem>
                */}
              </Nav>
            </Collapse>
          </Navbar>
        </header>
        <main>
          <Container>
            <Row>
              <Col xs="2">
                <div style={{padding: '.5rem 0', fontWeight: 700}}>
                  Collections
                </div>
              </Col>
              <Col xs="10">
                <Nav className="filter">
                  <NavItem>
                    <NavLink style={{color: !this.state.selectedCollection.id ? 'black': '#999999'}} onClick={(evt)=>this.getListings(evt, {}, {})}>All</NavLink>
                  </NavItem>
                  {this.state.collections.map(el => (
                      <NavItem>
                        <NavLink style={{color: this.state.selectedCollection.id == el.id ? 'black': '#999999'}} onClick={(evt)=>this.getListings(evt, el, {})}>{el.name}</NavLink>
                      </NavItem>
                    )
                  )}
                </Nav>
              </Col>
            </Row>
             <Row>
              <Col xs="2">
                <div style={{padding: '.5rem 0', fontWeight: 700}}>
                  Authors
                </div>
              </Col>
              <Col xs="10">
                <Nav className="filter">
                  <NavItem>
                    <NavLink style={{color: !this.state.selectedCollection.id ? 'black': '#999999'}} onClick={this.getAuthors}>All</NavLink>
                  </NavItem>
                  {this.state.authors.map(el => {
                    <ul>
                      <li>{el.name}</li>
                    </ul>
                  })}
                </Nav>
              </Col>
            </Row>
            <Row style={{marginBottom: '20px', borderBottom: '1px solid #eaeaea'}}>
              <Col xs="2">
                <div style={{padding: '.5rem 0', fontWeight: 700}}>
                  Artists
                </div>
              </Col>
              <Col xs="10">
                <Nav className="filter">
                  <NavItem>
                    <NavLink style={{color: !this.state.author ? 'black': '#999999'}} onClick={(evt)=>this.getListings(evt, {}, {})}>All</NavLink>
                  </NavItem>
                  {this.state.authors.map(el => (
                      <NavItem>
                        <NavLink style={{color: this.state.author && el.id == this.state.author.id ? 'black': '#999999'}} onClick={(evt)=>this.getListings(evt, {}, el)}>{el.name}</NavLink>
                      </NavItem>
                    )
                  )}
                </Nav>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>
                  {!this.state.selectedCollection.id ? 'Our clothes' : this.state.selectedCollection.name}
                  {!this.state.author.id ? ' by our artists' : ` by ${this.state.author.name}`}
                </h2>
              </Col>
            </Row>
            {this.state.loading ? (
                <div style={{margin: '50px auto', textAlign: 'center', height: '500px'}}>
                  <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
              ) : (
              <Row>
                {this.state.listings.map((el, index) => (
                  <Col xs="12" md="4" key={el.id}>
                    <div className={"listing-block-container"}>
                      <div style={{backgroundImage: `url(${FetchApi.getUrl()}/media/${el.photo})`}} className="listing-block"></div>
                      <div>
                        {console.log(el)}
                        <p>
                          {el.name}
                        </p>
                        <em>
                          by {el.name}
                        </em>
                        <em>
                          <img
                            src = "data:image/jpeg;base64,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"
                            alt = "image"
                           />
                        </em>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </main>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    
  };
}

export default connect(mapStateToProps)(HomeRoute);