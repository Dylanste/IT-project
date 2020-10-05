var express = require('express');
var router = express.Router();
var controller = require('../controller.js');



router.post('/register', controller.createUser);
router.post('/login', controller.loginUser);
router.get('/profile1/:user',controller.getProfile);

router.put('/profilebio/:user',controller.addBio);
router.put('/profilework/:user',controller.addWork);
router.put('/profilephone/:user',controller.addPhone);
router.put('/profileintro/:user',controller.addIntro);
router.put('/profileproject/:user',controller.addproject);
router.put('/profileskills/:user',controller.addSkills);
router.put('/profileedu/:user',controller.addEducation);
router.put('/profilesub/:user',controller.addSubjects);
router.put('/addprofilepic/:user',controller.addProfilePicture);
router.put('/addtranscript/:user',controller.addTranscript);

router.put('/addtogallery/:user',controller.addGallery);
router.put('/deletefromgallery/:user', controller.findGalleryPicAndDelete);

router.put('/addweb/:user',controller.addweb);
router.put('/namechange/:user',controller.changeName);

router.put('/deleteedu/:user',controller.deleteEducation);
router.put('/findanddeletsub/:user',controller.findSubjectsAndDelete);
router.put('/findanddeletwork/:user',controller.findWorkAndDelete);
router.put('/findanddeletproject/:user',controller.findProjectAndDelete);
router.put('/findanddeletskill/:user',controller.findSkillAndDelete);



// Find all users
router.get('/users', controller.findAllUsers);
 
// Find one user by id
router.get('/users/id/:id', controller.findOneUser);
 
//Find one user by name
router.get('/users/name/:name', controller.findUserByName);
module.exports = router;