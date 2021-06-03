//Setup Sammy.js
import Recipe from './controllers/recipeCtrl';
import User from './controllers/userCtrl';
import Kinvey from './helpers/kinvey';


window.allRecipes = []; //dom data
window.msgs = []; // hold all the notification messages that are generated based on user interaction
window.msgCounter = 0;
window.formData = {}; // holds the data that the user entered into forms
window.sharedData = {}; // data that is passed to the views
window.loggedIn = false; // determines the logged in state of the user
window.db = new Kinvey('kid_HJNicPfqd', '76e60e033b7444d79f8f4df192c76590');




//Initialize Sammy
const app = Sammy('#rooter', function() {
    this.use('Handlebars', 'hbs')





    db.get('recipes', null, { username: 'guest', password: 'guest' }).then(res => {
        allRecipes = res;
    })

    const recipeCtrl = new Recipe();
    const userCtrl = new User();

    //@route    GET  /
    //@desc     render Home Page for a logged-In user
    //@access   Public
    this.get('#/', recipeCtrl.getHome)


    //@route    GET  /recipes/share
    //@desc     render shared recipes
    //@access   Public
    this.get('#/recipes/share', recipeCtrl.getShareRecipe);

    //@route    POST  /recipes/share
    //@desc     render shared recipes
    //@access   Public
    this.post('#/recipes/share', recipeCtrl.postShareRecipe);


    //@route    GET  /user/login
    //@desc     render user login page
    //@access   Private
    this.get('#/user/login', userCtrl.getLogin)

    //@route    POST  /user/login
    //@desc     process and login users
    //@access   Private
    this.post('#/user/login', userCtrl.postLogin)

    //@route    GET  /user/signup
    //@desc     render signup Page 
    //@access   Public
    this.get('#/user/signup', userCtrl.getSignup)


    //@route    POST  /user/signup
    //@desc     process and sigup users
    //@access   Private
    this.post('#/user/signup', userCtrl.postSignup)

    //@route    GET  /user/logout
    //@desc     logoout a user 
    //@access   Private
    this.get('#/user/logout', userCtrl.getLogout);

    //@route    GET  /recipes/details/:id
    //@desc     render recipes/ details view
    //@access   Public
    // this.get('/recipes/details/:id', recipeCtrl.getDetails);
    this.get('#/details/:id', recipeCtrl.getDetails);

    //@route    GET  /recipe/archive/:id
    //@desc     Archive a recipe
    //@access   Private
    this.get('#/recipe/archive/:id', recipeCtrl.getArchive);

    //@route    GET  /recipe/edit/:id
    //@desc     Edit a recipe
    //@access   Private
    this.get('#/recipe/edit/:id', recipeCtrl.getEdit);

    //@route    POST  /recipe/edit/:id
    //@desc     Edit a recipe
    //@access   Private
    this.post('#/recipe/edit', recipeCtrl.postEdit);

    //@route    POST  /recipe/details/like
    //@desc     Like a recipe
    //@access   Private
    this.get('#/recipe/like/:id', recipeCtrl.getLike);


})

app.run('#/')