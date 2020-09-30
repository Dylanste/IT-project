import React, { Component } from 'react'

import axios from 'axios';
import {connect} from 'react-redux';
import { Button, Modal} from 'react-bootstrap';
import styled from 'styled-components';
import logo from './logo.svg';
import PropTypes from 'prop-types';

import {  logoutUser } from "./../actions/authActions";

import Footer from "./Footer";
import "./profile_pic.css";
import "./css/default.css";
import "./css/fonts.css";
import "./css/layout.css";
import "./css/magnific-popup.css";
import "./css/media-queries.css";

const Styles = styled.div
`
  .navbar { background-color: #365; }
  a, .navbar-nav, .navbar-light .nav-link {
    color: #000000;
    &:hover { color: #365; }
  }
  .navbar-brand {
    font-size: 1.4em;
    color: #000000;
    &:hover { color: #365; }
  }
  .dropdown-center {
    position: absolute !important;
    left: 50%;
    right: 50%;
  }
  .color-nav {
      background-color : rgb(255,255,255);
  }
  .nav.nav-center {
    display: inline-block;
    left: 0;
    right: 0;
    margin:0;
    float:none;
  }
  .float-container {
    border: 3px solid #fff;
    padding: 20px;
}

.float-child {
    width: 50%;
    float: left;
    padding: 20px;
    border: 2px solid red;
} 
.education1 {
  padding: 90px 0 72px; background: #fff;
} 
`;
function DisplayList(props) {
  const items = props;
  const listItems = items.map( (item, index) =>
    <li key = {index} >{item}</li>
  );
  return (
    <ul style={{textAlign: 'center', paddingBlock:'20px' }}>{listItems}</ul> 
  );
}

function DisplayList2(props) {
  var items = props;
  console.log();
  

  const listItems = items.map( (item, index) =>
<li style={{margin:'25'}} key = {index} >{item.school}</li>
  );
  return (
    <ul style={{textAlign: 'center', paddingBlock:'20px' }}>{listItems}</ul> 
  );
}



class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      bio: '',
      skills: [],
      subjects: [],
      education: [],
      website: '',
      phone: '',
      selectedFile: null,
      profilePicture: '',
      showAdd:false,
      addsubjectname:'',
      addsubjectyear:'',
      addsubjectdescripition:''
    };
  this.onLogoutClick=this.onLogoutClick.bind(this);
  this.onChange =this.onChange.bind(this);
  this.onSubmitSubject =this.onSubmitSubject.bind(this);
  
}
showAddModal = () => {
  this.setState({ showAdd: true });
};

hideAddModal = () => {
  this.setState({subjectname:''});
  this.setState({subjectdescripition:''});
  this.setState({subjectyear:''});
  this.setState({ showAdd: false });
};
onChange = (e) => {
  
  this.setState({[e.target.name]: e.target.value});
}
onSubmitSubject = (e) =>{
  
  e.preventDefault();


  const userData = {
    subjectname: this.state.addsubjectname,
    subjectdesc: this.state.addsubjectdescripition,
    year: this.state.addsubjectyear
};
console.log(userData);

axios.put('/profilesub/'+this.props.auth.user,userData)


  this.setState({addsubjectname:''});
  this.setState({addsubjectdescripition:''});
  this.setState({addsubjectyear:''});
  this.setState({showAdd:false});


}


    onLogoutClick = (e) => {
      e.preventDefault();
      this.props.logoutUser();
      this.props.history.push('/login');
  };
  componentDidMount() {
    axios
        .get('/profile1/'+(this.props.auth.user))
        .then(res=>{
          this.setState({email:res.data[0].email,
                         name:res.data[0].name,
                         bio:res.data[0].bio,
                         skills:res.data[0].skills,
                         subjects:res.data[0].subjects,
                         education:res.data[0].education,
                         website:res.data[0].website,
                         phone:res.data[0].phone,
                         profilePicture: res.data[0].profile_picture,
                         imgHash: Date.now()
                        });
          })
    
}

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

 



  fileUploadHandler = () => {
    const fd = new FormData();
    if (this.state.selectedFile == null) {
      return (Error);
    }
    if (this.state.profilePicture !==  "https://it-project-bucket-2020.s3-ap-southeast-1.amazonaws.com/blank-profile.png") {
      axios.delete('/deletepicture', {
        params: {
          url: this.state.profilePicture
        }
      }).then(res=> {
        
      })
    }


    fd.append('image', this.state.selectedFile);
      try {
        axios.post('/img-upload', fd).then((postResponse) => {
        this.newPP = postResponse.data.imageUrl;
       
      }, (err) => {
        console.log(err);
      }).then(() => {
        //do PUT call
        const data = {
          profilePic: this.newPP
        }
        
        axios.put('/addprofilepic/' + this.props.auth.user, data).then((putResponse) => {
          //do PUT stuff with response
          this.setState({
            profilePicture: this.newPP
          });
          
        })
      })

    }catch(err) {
      console.log(err);
    };
  }

  
  render() {
function deletesubject(index,user) {
        
        axios.put('findanddeletsub/'+user,index)
        .then(response=> window.location.reload())
        .catch(error => {
          console.log("handlesubmit error for blog ", error)
      })
        
        
     
      }
      
    
    
    if ((this.state.email.length)===0)
    { console.log("1");
      this.componentDidMount();
      return null;
    }
  
    function DisplayList1(items,user) {
      
      console.log();
      const sortedActivities = items.sort((a, b) => b.subjectyear - a.subjectyear);
      items= sortedActivities;
      
      const listItems = items.map( (item, index) =>
    <li key = {index} >{item.subjectname}: {item.subjectdescripition} {item.subjectyear} <Button onClick={() => {deletesubject(items[index],user)}}>Delete</Button></li>
      );
      return (
        <ul style={{textAlign: 'center', paddingBlock:'20px' }}>{listItems}</ul> 
      );
    }
    
    return (
      
      <div>
        
        <header id="home">
        <nav id="nav-wrap">

        <a className="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
        <a className="mobile-btn" href="#home" title="Hide navigation">Hide navigation</a>

        <ul id="nav" className="nav">
        <li className="current"><a className="smoothscroll" href="#home">Home</a></li>
   <li><a className="smoothscroll" href="#about">Education</a></li>
  <li><a className="smoothscroll" href="#skills">Skills</a></li>
   <li><a className="smoothscroll" href="#projects">Projects</a></li>
   <li><a className="smoothscroll" href="#subjects">Subjects</a></li>
   <li><a className="smoothscroll" href="#contact">Contact</a></li>
   <li><a className="smoothscroll" href="" onClick={this.onLogoutClick}>Logout</a></li>
</ul>

</nav>
        <div class="row banner">
         <div class="banner-text">
          
            <h1 class="responsive-headline"> I'm  {this.state.name} </h1>
            <div class="float-container">
            <div class="float-child">
            <img key = {this.state.imgHash} src = {this.state.profilePicture} class = "profile_pic" alt = "profilePic"/>
            
            
              </div>

                <div class="float-child">
                <input type = "file" accept=".jpg, .png" onChange={this.fileSelectedHandler}/>
            <button onClick={this.fileUploadHandler}>Upload</button>
                <h3> <a class="smoothscroll" href="#about" float="left" width="50%"> {this.state.bio}</a></h3>
             </div>
            </div>
            
            <hr />
            
         </div>
      </div>
      </header>
      <section id="about">
      <div className="row">
       
         <div className="nine columns main-col">
            <h2>About Me</h2>

            <p>{this.state.bio}</p>
            <div className="row">
               <div className="columns contact-details">
                  <h2>Contact Details</h2>
                  <p className="address">
						   <span>{this.state.phone}</span><br />
                     <span>{this.state.email}</span>
					   </p>
               </div>
               <div className="columns download">
                  <p>
                  
                  </p>
               </div>
            </div>
         </div>
      </div>

   </section>
   
   <section id="education">
      <div style={{backgroundColor:'#fff'}}>
      <h2 style={{textAlign: 'center', paddingBlock:'10px',fontFamily:'Times New Roman'}}>Education</h2>
      <div>         
            <p  class="lead add-bottom" style= {{ fontSize: '20px'}}  > {DisplayList2(this.state.education)} </p>
      </div>
            
      
      </div>

   </section>

   <section id="skills">
      <div style={{backgroundColor:'#fff'}}>
      <h2 style={{textAlign: 'center', paddingBlock:'10px',fontFamily:'Times New Roman'}}>Skills</h2>
      <div>         
      <p style= {{ fontSize: '25px'}} > {DisplayList(this.state.skills)} </p>
      </div>
            
      
      </div>

   </section>
   <section id="subjects">
      <div style={{backgroundColor:'#fff'}}>
      <h2 style={{textAlign: 'center', paddingBlock:'10px',fontFamily:'Times New Roman'}}>Subjects</h2>
      <div>         
      <p style= {{ fontSize: '25px'}} > {DisplayList1(this.state.subjects, this.props.auth.user)} </p>
      <button style={{alignItems:'center'}} onClick={this.showAddModal}>Add Subjects</button>
      <Modal show={this.state.showAdd} >
        <Modal.Header closeButton onClick={this.hideAddModal}></Modal.Header>
      <h2 style={{textAlign: 'center', paddingBlock:'10px',fontFamily:'Times New Roman'}}>Add Subjects</h2>
      <form onSubmit={this.onSubmitSubject}>
                  <div className="form-group">
                    <input onChange={this.onChange}
                      value={this.state.addsubjectname}
                      
                      type="text"
                      className={("form-control")}
                      placeholder="Add Subject Name"
                      name="addsubjectname"
                          
                          required autoFocus 
                    />
                  </div>
                  <div className="form-group">
                    <input onChange={this.onChange}
                      value={this.state.addsubjectdescripition}
                      
                      type="text"
                      className={("form-control")}
                      placeholder="Add Subject Description"
                      name="addsubjectdescripition"
                          
                          required autoFocus 
                    />
                  </div>
                  <div className="form-group">
                    <input onChange={this.onChange}
                      value={this.state.addsubjectyear}
                      
                      type="text"
                      className={("form-control")}
                      placeholder="Add Subject Year"
                      name="addsubjectyear"
                          
                          required autoFocus 
                    />
                  </div>
                  <button type="submit" style={{alignContent: 'center', paddingBlock:'10px' }}> Submit</button>
                  </form>

      
        </Modal>
      </div>
            
      
      </div>

   </section>


      
        <div>
            
        </div>

        <Footer/>
      </div>
    )
  }
}
Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
  });
export default connect(mapStateToProps, {logoutUser})(Profile);