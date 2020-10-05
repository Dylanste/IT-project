import React, { Component } from 'react'

import axios from 'axios';
import {connect} from 'react-redux';
import { Nav, Navbar, Dropdown, Card, CardGroup, Accordion, AccordionToggle,Button, Modal} from 'react-bootstrap';
import styled from 'styled-components';
import logo from './logo.svg';
import PropTypes from 'prop-types';
import { setCurrentUser, logoutUser } from "./../actions/authActions";
import Footer from './Footer.js';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';



import "./profile_pic.css";
import "./css/default.css";
import "./css/fonts.css";
import "./css/layout.css";
import "./css/magnific-popup.css";
import "./css/media-queries.css";
import en from "./i18n/en";
import cn from "./i18n/cn";
import jp from "./i18n/jp";

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

function startDownload(url) {
  window.location.href(url)
}


//Translation
counterpart.registerTranslations('en',en);
counterpart.registerTranslations('cn',cn);
counterpart.registerTranslations('jp',jp);

counterpart.setLocale('en');

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
      gallery: [],
      website: '',
      phone: '',
      selectedFile: null,
      profilePicture: '',
      transcript: '',
      showAdd:false,
      showlang:false,
      addsubjectname:'',
      addsubjectyear:'',
      addsubjectdescripition:'',
      addgallerydescription:'',
      lang:'en'
    };
  this.onLogoutClick=this.onLogoutClick.bind(this);
  this.onChange =this.onChange.bind(this);
  this.onSubmitSubject =this.onSubmitSubject.bind(this);

  
}
switchtoen = () => {
  
  counterpart.setLocale('en')
  this.setState({showlang:false});
};
switchtocn = () => {
  
  counterpart.setLocale('cn');
  this.setState({showlang:false});
};
switchtojp= () => {
  
  counterpart.setLocale('jp')
  this.setState({showlang:false});
};
showLanguage =() => {
this.setState({showlang:true});
};
hideLanguage =() => {
  this.setState({showlang:false});
  };
showAddModal = () => {
  this.setState({ showAdd: true });
};

hideAddModal = () => {
  this.setState({addsubjectname:''});
  this.setState({addsubjectdescripition:''});
  this.setState({addsubjectyear:''});
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


handleGalleryChange = event => {

  event.preventDefault();
  
  this.setState({
    addgallerydescription: event.target.value
  })
}

onSubmitGalleryPhoto = (e) => {

  e.preventDefault();

  const fd = new FormData();

  if (this.state.selectedFile == null) {
    return (Error);
  }

  const photoDesc =  this.state.addgallerydescription;

  fd.append('image', this.state.selectedFile);

  axios.post('/img-upload', fd).then((postResponse) => {
    console.log(postResponse);
    this.newGP = postResponse.data.imageUrl;

    const galleryPhoto = {
      imagesource: this.newGP,
      description: photoDesc
    };

    console.log(galleryPhoto);

    axios.put('/addtogallery/' + this.props.auth.user, galleryPhoto).then(res => {
      console.log(res);
    })
   
  }, (err) => {
    console.log(err);
  })


  this.setState({addgallerydescription:''});

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
                         gallery:res.data[0].gallery,
                         education:res.data[0].education,
                         website:res.data[0].website,
                         phone:res.data[0].phone,
                         profilePicture: res.data[0].profile_picture,
                         transcript: res.data[0].transcript,
                         imgHash: Date.now()
                        });
          })
    
}

  fileSelectedHandler = event => {
    event.preventDefault();

    this.setState({
      selectedFile: event.target.files[0]
    })
  }

 

  pdfUploadHandler = () => {
    const fd = new FormData();
    if (this.state.selectedFile == null) {
      return (Error);
    }
    if (this.state.transcript !== "") {
      axios.delete('/deletefile', {
        params: {
          url: this.state.transcript
        }
      }).then(res=> {
        console.log(res);
      })
    }


    fd.append('transcript', this.state.selectedFile);
      try {
        axios.post('/pdf-upload', fd).then((postResponse) => {
        this.newTrans = postResponse.data.transcriptUrl;
       
      }, (err) => {
        console.log(err);
      }).then(() => {
        //do PUT call
        const data = {
          transcript: this.newTrans
        }
        
        axios.put('/addtranscript/' + this.props.auth.user, data).then((putResponse) => {
          //do PUT stuff with response
          this.setState({
            transcript: this.newTrans
          });
          
        })
      })

    }catch(err) {
      console.log(err);
    };
    this.setState({
      selectedFile:null
    });
  }



  imgUploadHandler = () => {
    const fd = new FormData();
    if (this.state.selectedFile == null) {
      return (Error);
    }
    if (this.state.profilePicture !==  "https://it-project-bucket-2020.s3-ap-southeast-1.amazonaws.com/blank-profile.png") {
      axios.delete('/deletefile', {
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
    this.setState({
      selectedFile:null
    });
  }
  
  deletesubject(index,user) {
  axios.put('findanddeletsub/'+user,index)
      .then(res=> this.setState({subjects:res.data.subjects}))
      .catch(error => {
        console.log("handlesubmit error for blog ", error)
    })

    
  }
  //onClick={()=>{this.deletesubject((this.state.subjects)[index],this.props.auth.user)}}

  deletegallerypic(index, user) {
    axios.put('deletefromgallery/' + user,index).then(res => this.setState({gallery:res.data.gallery}))
    .catch(err => {
      console.log("delete error for gallery", err);
    })
  }

  
  render() {
    
      
    
  if ((this.state.email.length)===0)
  { console.log("1");
    this.componentDidMount();
    return null;
  }

    
        
    return (
      <div>    
        <header >
        <nav id="nav-wrap">
        <ul id="nav" className="nav">
        <li className="current"><a className="smoothscroll" href="#home">Home</a></li>
   <li><a className="smoothscroll" href="#about"><Translate content='education'></Translate> </a></li>
  <li><a className="smoothscroll" href="#skills"><Translate content='skills'></Translate> </a></li>
   <li><a className="smoothscroll" href="#projects"><Translate content='projects'></Translate> </a></li>
   <li><a className="smoothscroll" href="#subjects"><Translate content='subjects'></Translate> </a></li>
   <li><a className="smoothscroll" href="#contact"><Translate content='contact'></Translate> </a></li>
   <li><a className="smoothscroll" href="#" onClick={this.showLanguage}> <Translate content='language'></Translate> </a> </li>
   <Modal show={this.state.showlang} >
        <Modal.Header closeButton onClick={this.hideLanguage}></Modal.Header>
        <button type="button" class="block" onClick={this.switchtoen}>English</button> 
        <button type="button" class="block" onClick={this.switchtocn}>Chinese</button> 
        <button type="button" class="block"onClick={this.switchtojp}>Japanese</button> 

      

      
    </Modal>
   <li><a className="smoothscroll" href="" onClick={this.onLogoutClick}><Translate content='logout'></Translate> </a></li>
</ul>
</nav>

        <div class="row banner">
         <div class="banner-text">
            
            <h1 class="responsive-headline"> <Translate content='Im'></Translate>  {this.state.name} </h1>
            <div class="float-container">
            <div class="float-child">
            <img key = {this.state.imgHash} src = {this.state.profilePicture} class = "profile_pic" alt = "profilePic"/>
            
            
              </div>

                <div class="float-child">
                <input type = "file" accept=".jpg, .png" onChange={this.fileSelectedHandler}/>

            <button onClick={this.imgUploadHandler}><Translate content='upload'></Translate> </button>

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
            <h2><Translate content='about_me'></Translate> </h2>

            <p>{this.state.bio}</p>
            <div className="row">
               <div className="columns contact-details">
                  <h2><Translate content='contact_details'></Translate> </h2>
                  <p className="address">
						   <span>{this.state.phone}</span><br />
                     <span>{this.state.email}</span>
					   </p>
               </div>
               <div className="columns download">
                  <p>
                  <input type = "file" accept = ".pdf" onChange={this.fileSelectedHandler}/>
                  <button onClick={this.pdfUploadHandler}>Upload Transcript </button>
                  <a href = {this.state.transcript} target = "_blank" rel ="noopener noreferrer" download = "transcript">Click to Download Transcript</a>
                  
                  </p>
               </div>
            </div>
         </div>
      </div>

   </section>
   
   <section id="education">
      <div style={{backgroundColor:'#fff'}}>
      <h2 style={{textAlign: 'center', paddingBlock:'10px',fontFamily:'Times New Roman'}}><Translate content='education'></Translate> </h2>
      <div>         
            <p  class="lead add-bottom" style= {{ fontSize: '20px'}}  > {DisplayList2(this.state.education)} </p>
      </div>
            
      
      </div>

   </section>



   <section id="skills">
      <div style={{backgroundColor:'#fff'}}>
      <h2 style={{textAlign: 'center', paddingBlock:'10px',fontFamily:'Times New Roman'}}><Translate content='skills'></Translate> </h2>
      <div>         
      <p style= {{ fontSize: '25px'}} > {DisplayList(this.state.skills)} </p>
      </div>
            
      
      </div>

   </section>

   <section id = "gallery">
   <div style={{backgroundColor:'#fff'}}>
      <h2 style={{textAlign: 'center', paddingBlock:'10px',fontFamily:'Times New Roman'}}>Gallery</h2>
      <p style= {{ fontSize: '25px'}} > {<ul style={{textAlign: 'center', paddingBlock:'20px' }}>
        {(this.state.gallery).map( (item, index) =>
          <li>
            <h3> {item.description} </h3>
            <img key={index} src={item.imagesource} alt="galleryPhoto"></img>
            <Button onClick={()=>{this.deletegallerypic((this.state.gallery)[index],this.props.auth.user)}} > Delete Image</Button>
          </li>
          )}</ul> } 
      </p>

        <form name="uploadForm" onkeydown="return event.key != 'Enter';">
          <div>
            <input type = "file" accept=".jpg, .png" onChange={this.fileSelectedHandler}/>
          </div>
          <div>
            <h2> Add Photo Description </h2>
            <input type = "text" value = {this.state.addgallerydescription} onChange = {this.handleGalleryChange}/>
          </div>
          <div><button type="button" onClick={this.onSubmitGalleryPhoto}>Upload Gallery </button></div>
          </form>
      
      </div>
    </section>

   <section id="subjects">
      <div style={{backgroundColor:'#fff'}}>
      <h2 style={{textAlign: 'center', paddingBlock:'10px',fontFamily:'Times New Roman'}}><Translate content='subjects'></Translate> </h2>
      <div>         
      <p style= {{ fontSize: '25px'}} > {<ul style={{textAlign: 'center', paddingBlock:'20px' }}>{(this.state.subjects).map( (item, index) =>
  <li key = {index} >{item.subjectname}: {item.subjectdescripition} {item.subjectyear} <Button onClick={()=>{this.deletesubject((this.state.subjects)[index],this.props.auth.user)}}>Delete</Button></li>
    )}</ul> } </p>
      <button style={{alignItems:'center'}} onClick={this.showAddModal}><Translate content='add_subjects'></Translate> </button>
      <Modal show={this.state.showAdd} >
        <Modal.Header closeButton onClick={this.hideAddModal}></Modal.Header>
      <h2 style={{textAlign: 'center', paddingBlock:'10px',fontFamily:'Times New Roman'}}><Translate content='add_subjects'></Translate> </h2>
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