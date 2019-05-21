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
      authors: [],
      selected: [],
      dropdownOpen: false,
      loggedIn: true,
      newListingName: '',
      newListingCollectionId: '',
      newListingCollection: {},
      newListingAuthor: {},
      newListingAuthorId: '',
      newListingPhoto: {},
      editListingName: '',
      editListingAuthorName: '',
      editListingPhoto: {},
      collectionName: '',
      authorName: '',
    }
  }

  componentDidMount() {
    this.checkLogin();
    this.getListings();
    this.getCollections();
    this.getAuthors();
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
      const response = await FetchApi.upload({image: this.state.newListingPhoto});
      const listing = await FetchApi.post('/api/listings', {listing: {name: this.state.newListingName, author: this.state.newListingAuthor, collection: this.state.newListingCollection, photo: response.data.data.id}});
      this.getListings();
    } catch (e) {
      console.error(e);
    }
  }

  async editListing(evt) {
    evt.preventDefault();
    try {
      if(this.state.editListingPhoto.name) {
        const response = await FetchApi.upload({image: this.state.editListingPhoto});
        const listing = await FetchApi.put(`/api/listings/${this.state.selected[0]}`, {listing: {name: this.state.editListingName, authorName: this.state.editListingAuthorName, photo: response.data.data.id}});
      } else {
        const listing = await FetchApi.put(`/api/listings/${this.state.selected[0]}`, {listing: {name: this.state.editListingName, authorName: this.state.editListingAuthorName}});
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

  async getAuthors() {
    try {
      const authors = await FetchApi.get('/api/authors');
      this.setState({authors: authors.data.data})
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
      this.getAuthors();
    } catch (e) {
      console.log(e);
    }
  }

  async addCollection(evt) {
    evt.preventDefault();
    try {
      await FetchApi.post('/api/collections', {collection: {name: this.state.collectionName}});
      this.getCollections();
    } catch (e) {
      console.error(e);
    }
  }

  async addAuthor(evt) {
    try {
      await FetchApi.post('/api/authors', {author: {name: this.state.authorName}});
      this.getAuthors();
    }
    catch(e) {
      console.error(e);
    }
  }

  async addToCollection(collectionId) {
    try {
      for (let item of this.state.selected) {
        await FetchApi.patch(`/api/listings/${item}`, {collection: {id: collectionId}});
      }
      this.getCollections();
      this.getListings();
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
              editListingAuthorName: listing.author.name,
            });
          }
        } else {
          selected.splice(selected.indexOf(id), 1);
          if (selected.length == 1) {
            this.setState({
              editListingName: listing.name,
              editListingAuthorName: listing.author.name,
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
    {console.log(this.state)}
    if(!this.state.loggedIn) {
      return 'Error with authorization';
    }
    return (
      <section id="admin">
        <Button onClick={() => {
          this.props.history.push('/')
          }} type="btn">
          Home
        </Button>
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
                  <div style={{backgroundImage: `url(${FetchApi.getUrl()}/api/media/${el.photo}?width=200)`, border: this.state.selected.indexOf(el.id) > -1 ? '3px solid red' : 'none'}} className="listing-block" onClick={() => this.selectItem(el.id)}></div>
                  <div>{el.name}</div>
                  <p style={{'margin-buttom': '40px'}} className="listingName">By {el.author.name}</p>
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
              <div className="addListing" style={{marginTop: '100px'}}>
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
                      <ButtonDropdown isOpen={this.state.newListingAuthorDropdownOpen} toggle={() => this.setState({newListingAuthorDropdownOpen: !this.state.newListingAuthorDropdownOpen})}>   
                        <DropdownToggle caret>
                          Author
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.authors.map(el => (
                              <DropdownItem onClick={() => this.setState({newListingAuthor: el})} key={el.id}>{el.name}</DropdownItem>
                            )
                          )}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="collection" sm={2}>Collection</Label>
                    <Col sm={10}>
                      <ButtonDropdown isOpen={this.state.newListingCollectionDropdownOpen} toggle={() => this.setState({newListingCollectionDropdownOpen: !this.state.newListingCollectionDropdownOpen})}>
                        <DropdownToggle caret>
                          Collection
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.collections.map(el => (

                              <DropdownItem onClick={() => this.setState({newListingCollection: el})} key={el.id}>{el.name}</DropdownItem>
                            )
                          )}
                        </DropdownMenu>
                      </ButtonDropdown>
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
                      <Button disabled={!this.state.newListingName || !this.state.newListingAuthor || !this.state.newListingCollection || !this.state.newListingPhoto.name}>Submit</Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            ) : (
              <div className="editListing" style={{marginTop: '100px'}}>
                <h1>
                  Edit listing
                </h1>
                <Form onSubmit={(evt) => this.editListing(evt)}>
                  <FormGroup row>
                    <Label for="editname" sm={2}>Name</Label>
                    <Col sm={10}>
                      <Input type="text" name="editname" id="editname" placeholder="New listing name"  onChange={(evt) => this.setState({editListingName: evt.target.value})}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="author" sm={2}>Author</Label>
                    <Col sm={10}>
                      <ButtonDropdown isOpen={this.state.newListingAuthorDropdownOpen} toggle={() => this.setState({newListingAuthorDropdownOpen: !this.state.newListingAuthorDropdownOpen})}>
                        <DropdownToggle caret>
                          Author
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.authors.map(el => (
                              <DropdownItem onClick={() => this.setState({editListingAuthorName: el})} key={el.id}>{el.name}</DropdownItem>
                            )
                          )}
                        </DropdownMenu>
                      </ButtonDropdown>
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
                      <Button disabled={!this.state.editListingName || !this.state.editListingAuthorName || !this.state.editListingPhoto}>Submit</Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            )}
              <Row>
                <Col>
                  <h1 style={{marginTop: '40px'}}>
                    Your Collections
                  </h1>
                  {this.state.collections.map(el => (
                  <div key={el.id}>
                    {el.name}
                  </div>                  
                  ))}
                </Col>
              </Row>
              <Row >
                <Col>
                  <h1 style={{marginTop: '40px'}}>
                    Authors
                  </h1>
                  {this.state.authors.map(el => (
                    <div key={el.id}>
                      {el.name}
                    </div>
                  ))}
                </Col>
              </Row>
              
           
            
            {/* <div style={{marginTop: '100px'}}> */}
            {/*   <h1> */}
            {/*     Collections */}
            {/*   </h1> */}
            {/*   <Row> */}
            {/*     {this.state.collections.map((el, index) => ( */}
            {/*       <Col xs="4" md="2" key={el.id}> */}
            {/*         <div style={{border: '3px solid blue', padding: '20px'}}> */}
            {/*           <p>{el.name}</p> */}
            {/*           <em>{el.listings.length} items</em> */}
            {/*         </div> */}
            {/*       </Col> */}
            {/*     ))} */}
            {/*   </Row> */}
            {/* </div> */}
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
                <FormGroup check row>
                  <Col sm={{ size: 10, offset: 2 }}>
                    <Button disabled={!this.state.collectionName}>Submit</Button>
                  </Col>
                </FormGroup>
              </Form>
            </div>
            <div style={{marginTop: '100px'}}>
              <h1>
                Add new author
              </h1>
              <Form onSubmit={(evt) => this.addAuthor(evt)}>
                <FormGroup row>
                  <Label for="editname" sm={2}>Name</Label>
                  <Col sm={10}>
                    <Input type="text" name="authorname" id="authorname" placeholder="Author name" value={this.state.authorName} onChange={(evt) => this.setState({authorName: evt.target.value})}/>
                  </Col>
                </FormGroup>
                <FormGroup check row>
                  <Col sm={{ size: 10, offset: 2 }}>
                    <Button disabled={!this.state.authorName}>Submit</Button>
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