import React from 'react';
import FetchApi from '../../helpers/FetchApi';
import './index.css';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Collapse, NavbarToggler, Nav, NavItem, NavLink, Container, Row, Col, Button, Form, FormGroup, Input, Label, ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { Redirect } from 'react-router';

class AdminRoute extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      listings: [],
      collections: [],
      selected: [],
      dropdownOpen: false,
      loggedIn: true,
      newListingName: '',
      newListingAuthor: '',
      newListingPhoto: {},
      editListingName: '',
      editListingAuthor: '',
      editListingPhoto: {},
      collectionName: '',
      collectionAuthor: ''
    }
  }

  componentDidMount() {
    this.checkLogin();
    this.getListings();
    this.getCollections();
  }

  checkLogin() {
    if(!FetchApi.getToken()) {
      this.setState({loggedIn: false});
    }
  }

  async addListing(evt) {
    evt.preventDefault();
    try {
      if(!this.state.newListingPhoto.name) {
        return;
      }
      const response = await FetchApi.upload({photo: this.state.newListingPhoto});
      const listing = await FetchApi.post('/api/listings', {listing: {name: this.state.newListingName, author: this.state.newListingAuthor, photo: response.data.data.objectId}});
      this.getListings();
    } catch (e) {
      console.error(e);
    }
  }

  async editListing(evt) {
    evt.preventDefault();
    try {
      if(this.state.editListingPhoto.name) {
        const response = await FetchApi.upload({photo: this.state.editListingPhoto});
        const listing = await FetchApi.put(`/api/listings/${this.state.selected[0]}`, {listing: {name: this.state.editListingName, author: this.state.editListingAuthor, photo: response.data.data.objectId}});
      } else {
        const listing = await FetchApi.put(`/api/listings/${this.state.selected[0]}`, {listing: {name: this.state.editListingName, author: this.state.editListingAuthor}});
      }
      this.getListings();
    } catch (e) {
      console.error(e);
    }
  }

  async getListings() {
    try {
      const listings = await FetchApi.get('/api/listings');
      this.setState({listings: listings.data.data});
    } catch (e) {
      console.error(e);
    }
  }

  async getCollections() {
    try {
      const collections = await FetchApi.get('/api/collections');
      this.setState({collections: collections.data.data});
    } catch (e) {
      console.error(e);
    }
  }

  async removeItems() {
    try {
      for (let item of this.state.selected) {
        await FetchApi.delete(`/api/listings/${item}`);
      }
      this.getCollections();
      this.getListings();
    } catch (e) {
      console.log(e);
    }
  }

  async addCollection(evt) {
    evt.preventDefault();
    try {
      await FetchApi.post('/api/collections', {collection: {name: this.state.collectionName, author: this.state.collectionAuthor}});
      this.getCollections();
    } catch (e) {
      console.error(e);
    }
  }

  async addToCollection(collectionId) {
    try {
      for (let item of this.state.selected) {
        await FetchApi.patch(`/api/collections/${collectionId}`, {listingId: item});
      }
      this.getCollections();
    } catch (e) {
      console.log(e);
    }
  }

  selectItem(id) {
    let selected = [...this.state.selected];
    for(let listing of this.state.listings) {
      if (listing.id == id) {
        if (selected.indexOf(id) == -1) {
          selected.push(id);
          if (selected.length == 1) {
            this.setState({
              editListingName: listing.name,
              editListingAuthor: listing.author,
            });
          }
        } else {
          selected.splice(selected.indexOf(id), 1);
          if (selected.length == 1) {
            this.setState({
              editListingName: listing.name,
              editListingAuthor: listing.author,
            });
          }
        }
      }
    }
    this.setState({selected});
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <section id="admin">
        <header className="App-header">
          <Navbar light expand="md">
            <NavbarBrand>
              <Link className="nav-link" to="/admin">Admin</Link>
            </NavbarBrand>
            <NavbarToggler onClick={() => this.toggle()} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav>
                
              </Nav>
            </Collapse>
          </Navbar>
        </header>
        <main>
          <Container>
            <Row>
              <Col xs={"12"}>
                <h1>
                  Your listings
                </h1>
              </Col>
            </Row>
            <Row>
              {this.state.listings.map((el, index) => (
                <Col xs="4" md="2" key={el.id}>
                  <div style={{backgroundImage: `url(${FetchApi.getUrl()}/media/${el.photo})`, border: this.state.selected.indexOf(el.id) > -1 ? '3px solid red' : 'none'}} className="listing-block" onClick={() => this.selectItem(el.id)}></div>
                </Col>
              ))}
            </Row>
            {this.state.selected.length ? (
              <Row>
                <Col xs="12">
                  <div style={{float: 'right'}}>
                    <Button onClick={() => this.removeItems()} style={{margin: '10px 20px'}}>
                      Remove selected items
                    </Button>
                    <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={() => this.setState({dropdownOpen: !this.state.dropdownOpen})}>
                      <DropdownToggle caret>
                        Add to collection
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.state.collections.map(el => (
                            <DropdownItem onClick={() => this.addToCollection(el.id)} key={el.id}>{el.name}</DropdownItem>
                          )
                        )}
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </Col>
              </Row>
            ) : null}
            {this.state.selected.length !== 1 ? (
              <div style={{marginTop: '100px'}}>
                <h1>
                  Add new listing
                </h1>
                <Form onSubmit={(evt) => this.addListing(evt)}>
                  <FormGroup row>
                    <Label for="name" sm={2}>Name</Label>
                    <Col sm={10}>
                      <Input type="text" name="name" id="name" placeholder="Listing name" value={this.state.newListingName} onChange={(evt) => this.setState({newListingName: evt.target.value})}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="author" sm={2}>Author</Label>
                    <Col sm={10}>
                      <Input type="text" name="author" id="author" placeholder="Listing author" value={this.state.newListingAuthor} onChange={(evt) => this.setState({newListingAuthor: evt.target.value})}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="photo" sm={2}>File</Label>
                    <Col sm={10}>
                      <Input type="file" name="photo" id="photo" onChange={(evt) => this.setState({newListingPhoto: evt.target.files[0]})}/>
                    </Col>
                  </FormGroup>
                  <FormGroup check row>
                    <Col sm={{ size: 10, offset: 2 }}>
                      <Button disabled={!this.state.newListingName || !this.state.newListingAuthor || !this.state.newListingPhoto.name}>Submit</Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            ) : (
              <div style={{marginTop: '100px'}}>
                <h1>
                  Edit listing
                </h1>
                <Form onSubmit={(evt) => this.editListing(evt)}>
                  <FormGroup row>
                    <Label for="editname" sm={2}>Name</Label>
                    <Col sm={10}>
                      <Input type="text" name="editname" id="editname" placeholder="Listing name" value={this.state.editListingName} onChange={(evt) => this.setState({editListingName: evt.target.value})}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="author" sm={2}>Author</Label>
                    <Col sm={10}>
                      <Input type="text" name="editauthor" id="editauthor" placeholder="Listing author" value={this.state.editListingAuthor} onChange={(evt) => this.setState({editListingAuthor: evt.target.value})}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="photo" sm={2}>File</Label>
                    <Col sm={10}>
                      <Input type="file" name="photo" id="photo" onChange={(evt) => this.setState({editListingPhoto: evt.target.files[0]})}/>
                    </Col>
                  </FormGroup>
                  <FormGroup check row>
                    <Col sm={{ size: 10, offset: 2 }}>
                      <Button disabled={!this.state.editListingName || !this.state.editListingAuthor}>Submit</Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            )}
            <div style={{marginTop: '100px'}}>
              <h1>
                Collections
              </h1>
              <Row>
                {this.state.collections.map((el, index) => (
                  <Col xs="4" md="2" key={el.id}>
                    <div style={{border: '3px solid blue', padding: '20px'}}>
                      <p>{el.name}</p>
                      <em>{el.listings.length} items</em>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            <div style={{marginTop: '100px'}}>
              <h1>
                Add new collection
              </h1>
              <Form onSubmit={(evt) => this.addCollection(evt)}>
                <FormGroup row>
                  <Label for="editname" sm={2}>Name</Label>
                  <Col sm={10}>
                    <Input type="text" name="collectionname" id="collectionname" placeholder="Collection name" value={this.state.collectionName} onChange={(evt) => this.setState({collectionName: evt.target.value})}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="author" sm={2}>Author</Label>
                  <Col sm={10}>
                    <Input type="text" name="collectionauthor" id="collectionName" placeholder="Collection author" value={this.state.collectionAuthor} onChange={(evt) => this.setState({collectionAuthor: evt.target.value})}/>
                  </Col>
                </FormGroup>
                <FormGroup check row>
                  <Col sm={{ size: 10, offset: 2 }}>
                    <Button disabled={!this.state.collectionName || !this.state.collectionAuthor}>Submit</Button>
                  </Col>
                </FormGroup>
              </Form>
            </div>
          </Container>
        </main>
        {!this.state.loggedIn ? <Redirect to="/auth"/> : null}
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    
  };
}

export default connect(mapStateToProps)(AdminRoute);