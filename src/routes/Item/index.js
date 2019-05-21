import React from 'react';
import { Navbar, NavbarBrand, Collapse, NavbarToggler, Nav, NavItem, NavLink, Container, Button, Row, Col } from 'reactstrap';
import FetchApi from '../../helpers/FetchApi';
import { connect } from 'react-redux';
import heart from './heart.png';
import follower from './follower.png';
import image from './image.jpg';
import './index.css';

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }

}

  render() {
    {console.log(this.state)}
    return (
       <header>
         <Container>
           <Row>
              <Col xs={{size: '8'}}>
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
                   Test
                 </NavItem>
                 <NavItem className="headerItem slash">
                   /
                 </NavItem>
                 <NavItem className="headerItem slash">
                   Bandit Bing Tee
                 </NavItem>
                 </Nav>
              </Col>
              <Row>
                    <Col xs={{size: '1', offset: '1'}}>
                        <img className="heartImg" src={heart} alt='heart'/>
                        <Button className="likeBtn">Like</Button>
                    </Col>
                    <Col xs={{size: '1', offset: '1'}} >
                        <img className='followImg' src={follower} alt='follower'/>
                        <Button className='followBtn'>Follow</Button>
                    </Col>
              </Row>
           </Row>
           <Row noGutters={true}>
             <Col xs='4'>
               <img src={image} style={{marginRight: '18px', marginTop: '18px', width: '98%'}}/>
             </Col>
             <Col xs='4'>
               <img src={image} style={{marginRight: '18px', marginTop: '18px', width: '98%'}}/>
             </Col>
             <Col xs='4'>
               <img src={image} style={{marginRight: '18px', marginTop: '18px', width: '98%'}}/>
             </Col>
             
           </Row>
           <Row style={{marginTop: '27px'}}>
             <Col xs={{size: '5', offset: '1'}}>
               <div style={{fontWeight: 'bold', fontSize: '20px'}}>
                 Anine Bing
               </div>
               <div style={{color: '#333333', fontSize: '10px'}}>
                 Bandit Bing Tee
               </div>
             </Col>
             <Col xs={{size: '2', offset: '3'}}>
               <div style={{fontWeight: 'bold', fontSize: '20px'}}>
                 $99
               </div>
             </Col>
           </Row>
           <Row style={{marginTop: '30px',}}>
            <Col xs={{size: '3', offset: '8'}}>
             <Button className="buyBtn">
               Buy it!
             </Button>
            </Col>
           </Row>
         </Container>
       </header>

      );
    }
  }

export default Item;