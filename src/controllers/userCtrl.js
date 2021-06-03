import { loginValidation, signupValidation } from "../validation";
import clearStates from '../helpers/clearStates';


// function clearStates(viewData) {
//     msgs = [];
//     sharedData = {}; //validation data? 
//     viewData = {}
// }

export default class User {
    getLogin() {
        console.log('[getLogin] Display Login Page');
        const viewData = {...sharedData, loginActive: true, loggedIn }

        if (formData && msgs.length !== 0) {
            viewData.username ? viewData.username.input = formData.username : '';
            viewData.password ? viewData.password.input = formData.password : '';
            viewData.msgs = msgs;
        }

        this.loadPartials({
            navbar: '../views/partials/navbar.hbs',
            notifications: '../views/partials/notifications.hbs'
        }).then(function() {
            this.render('../views/users/login.hbs', viewData).swap()
            clearStates(viewData);
        })
    }


    postLogin() {
        console.log('[postLogin] Validate User Login');

        const { username, password } = this.params;
        formData = { username, password };

        let isValid = loginValidation(formData);

        if (!isValid) {
            this.redirect('#/user/login');
            return
        }

        sharedData.isLoading = true;
        this.redirect('#/user/login');

        db.login({ username, password }).then(jsonRes => {
            sessionStorage.setItem('userId', jsonRes._id);
            sessionStorage.setItem('firstname', jsonRes.firstname);
            sessionStorage.setItem('lastname', jsonRes.lastname);
            sessionStorage.setItem('loggedIn', jsonRes._kmd.authtoken);
            loggedIn = true;
            msgs.push({ msg: 'Logged In successully!', class: 'alert-success' })
            sharedData.isLoading = false;
            this.redirect('#/')
        }).catch(err => {
            msgs.push({ msg: 'Invalid credentials. Please retry your request with correct credentials', class: 'alert-danger' });
            sharedData.username = {}
            sharedData.username.invalid = true;
            sharedData.password = {};
            sharedData.isLoading = false;
            this.redirect('#/user/login');
        })

    }


    getSignup() {
        console.log('[getSignUp] Display Signup Form')
        const viewData = {...sharedData, signupActive: true, loggedIn }

        if (formData && msgs.length !== 0) {
            viewData.firstname.input = formData.firstname;
            viewData.lastname.input = formData.lastname;
            viewData.username.input = formData.username;
            viewData.password.input = formData.password;
            viewData.password2.input = formData.password2;
            viewData.msgs = msgs;
        }

        this.loadPartials({
            navbar: '../views/partials/navbar.hbs',
            notifications: '../views/partials/notifications.hbs'
        }).then(function() {
            this.render('../views/users/signup.hbs', viewData).swap()
            clearStates(viewData)
        })
    }


    postSignup() {
        console.log('[postsignUp] Validate Signup Form')
        const { firstname, lastname, username, password, password2 } = this.params;
        formData = { firstname, lastname, username, password2, password };
        let isValid = signupValidation(formData);

        if (!isValid) {
            this.redirect('#/user/signup');
            return
        }
        console.log('[postSignUp] isValid')
        sharedData.isLoading = true;
        this.redirect('#/user/signup')
        db.signup({ username, password, firstname, lastname, username }).then(res => {
            console.log(res);
            msgs.push({ msg: 'User Created Successfully !', class: 'alert-success' })
            sharedData.isLoading = false;
            this.redirect('#/user/login');
            formData = {}
        }).catch(err => {
            if (err.status === 409) {
                console.log('[postSignUp] isInvalid')
                msgs.push({ msg: 'Invalid credentials. Please retry your request with correct credentials', class: 'alert-danger' });
                sharedData.firstname = {};
                sharedData.lastname = {};
                sharedData.username = {};
                sharedData.username.invalid = true;
                sharedData.password = {};
                sharedData.password2 = {};
                sharedData.isLoading = false;
                console.log(sharedData)
                this.redirect('#/user/signup');
            }
        })
    }


    getLogout() {
        console.log('[getLogout] User Logged Out')
        let token = sessionStorage.getItem('loggedIn');
        db.logout(token).then(res => {
            msgs = [];
            msgs.push({ msg: 'Logged out Successfully !', class: 'alert-success' });
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('username');
            loggedIn = false;
            this.redirect('#/user/login');
        }).catch(err => {
            msgs.push({ msg: err.statusText, class: 'alert-danger' });
            this.redirect('#/')
        })
    }
}