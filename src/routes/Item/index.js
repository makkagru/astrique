import React from 'react';
import { Nav, NavItem, Container, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import FetchApi from '../../helpers/FetchApi';
import { connect } from 'react-redux';
import heart from './heart.png';
import follower from './follower.png';
import itemListing from '../Admin/index';
import image from './image.jpg';
import './index.css';

class Item extends React.Component {
  constructor(props) {
    super(props);
    let item = this.props.location.state.item;
    this.state = {
      item,
      modal: false
    }

}

 toggle = () => {
    this.setState({modal: !this.state.modal});
}


  render() {
    console.log(this.state)
      return (
       <header>
         <Container>
         <h1 style={{paddingTop: '11px'}}>
                Logo
              </h1>
           <Row>
              <Col xs={{size: '6'}}>
                <Nav className="headerItems">
                 <NavItem>
                   Home
                 </NavItem>
                 <NavItem className="headerItem slash">
                   /
                 </NavItem>
                 <NavItem className="headerItem">
                   All Designers
                 </NavItem>
                 <NavItem className="headerItem slash"> 
                   /
                 </NavItem>
                 <NavItem className="headerItem">
                  {this.state.item.author.name}
                 </NavItem>
                 <NavItem className="headerItem slash">
                   /
                 </NavItem>
                 <NavItem className="headerItem slash">
                   {this.state.item.name}
                 </NavItem>
                 </Nav>
              </Col>
                <Col xs={{size: '6'}} md={{offset: '3', size: '3'}}>
                  <Row>
                    <Col xs={{size: '6'}}>
                        <Row style={{paddingTop: '15px'}}>
                            <Col xs={{size: '2'}}>
                              <img className="heartImg" src={heart} alt='heart'/>
                            </Col>
                            <Col xs={{size: '2'}}>
                              <Button className="likeBtn">Like</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={{size: '6'}}>
                        <Row style={{paddingTop: '15px'}}>
                            <Col xs={{size: '2'}}>
                              <img className='followImg' src={follower} alt='follower'/>
                            </Col>
                            <Col xs={{size: '2'}}>
                              <Button className='followBtn'>Follow</Button>
                            </Col>
                        </Row>
                    </Col>
                  </Row>
              </Col>
           </Row>
           <Row noGutters={true} className="listingImage"> 
             <Col xs='6' md='4' style={{backgroundImage: `url(${FetchApi.getUrl()}/api/media/${this.state.item.photo}?width=300`, backgroundSize: 'cover'}}>
             </Col>
             <Col xs='6' md='4'>
               <img src={image} style={{marginRight: '18px', marginTop: '18px', width: '98%'}} alt="Img"/>
             </Col>
             <Col xs='6' md='4'>
               <img src={image} style={{marginRight: '18px', marginTop: '18px', width: '98%'}} alt="Img"/>
             </Col>
             
           </Row>
           <Row style={{marginTop: '27px'}}>
             <Col xs={{size: '5', offset: '1'}}>
               <div style={{fontWeight: 'bold', fontSize: '20px'}}>
                 {this.state.item.name}
               </div>
               <div style={{color: '#333333', fontSize: '10px'}}>
                 {this.state.item.author.name}
               </div>
             </Col>
             <Col xs={{size: '2', offset: '4'}}>
               <div style={{fontWeight: 'bold', fontSize: '20px'}}>
                 ${this.state.item.value}
               </div>
             </Col>
           </Row>
           <Row style={{marginTop: '30px',}}>
            <Col xs={{size: '5', offset: '7'}} lg={{size: '3', offset: '9'}}>
               <Button className="buyBtn" onClick={this.toggle}>
                 Buy it!
               </Button>
               <Modal isOpen={this.state.modal} fade={false}
                       toggle={this.toggle} style={{width: "200px", display: "block", justifyContent: 'center'}}>
                    <ModalHeader toggle={this.toggle}>
                    </ModalHeader>
                    <ModalBody>
                        <h1>
                          Number of Artist: +374********
                        </h1>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.toggle}>
                            Ok
                        </Button>
                        <Button onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
             </Col>
           </Row>
      </Container>
    </header>

      );
    }
  }

export default Item;