// import clearStates from '../helpers/clearStates';
import { createValidation } from "../validation";
import clearStates from "../helpers/clearStates";
import username from "../helpers/username";


export default class Recipe {

    getHome() {
        console.log('[getHome] Display Home Page')
        const firstname = sessionStorage.getItem('firstname');
        const lastname = sessionStorage.getItem('lastname');
        const viewData = {...sharedData, homeActive: true, firstname, lastname, loggedIn, msgs }


        if (allRecipes.length != 0) {
            console.log('[getHome] No Need To Fetch From The Server')

            // No need to fetch from the server 
            viewData.allRecipes = allRecipes;
            viewData.isLoading = false;


            if (viewData.loggedIn && allRecipes.length > 0) {
                viewData.displayRecipes = true;
            } else {
                viewData.displayRecipes = false;
            }



            this.loadPartials({
                navbar: '../views/partials/navbar.hbs',
                notifications: '../views/partials/notifications.hbs',
                footer: '../views/partials/footer.hbs',
            }).then(function() {
                this.render('../views/app/home.hbs', viewData).swap()
                clearStates();
            })

        } else {
            console.log('[getHome] Fetch From The Server')

            //Go and fetch from server
            this.loadPartials({
                navbar: '../views/partials/navbar.hbs',
                notifications: '../views/partials/notifications.hbs',
                footer: '../views/partials/footer.hbs'
            }).then(function() {

                viewData.isLoading = true;
                this.render('../views/app/home.hbs', viewData).swap()

                db.get('recipes', null, { username: 'guest', password: 'guest' }).then(res => {
                    allRecipes = res;
                    viewData.allRecipes = res;

                    if (viewData.loggedIn && allRecipes.length > 0) {
                        viewData.displayRecipes = true;
                    } else {
                        viewData.displayRecipes = false;
                    }

                    viewData.isLoading = false;
                    this.render('../views/app/home.hbs', viewData).swap()
                    clearStates();
                })
            })

        }
    }


    getShareRecipe() {
        console.log('[getShareRecipe] Display New Recipe Form Layout');
        formData = {};

        const viewData = {...sharedData, addActive: true, loggedIn }
        username(viewData);
        if (formData && msgCounter != 0) {
            const options = {
                'Vegetables and legumes/beans': 'option1',
                'Fruits': 'option2',
                'Grain Food': 'option3',
                'Milk, cheese, eggs and alternatives': 'option4',
                'Lean meats and poultry, fish and alternatives': 'option5'
            }
            const selected = options[sessionStorage.getItem('categorySelection')];

            msgCounter = 0; //reset counter
            viewData.meal.input = sharedData.meal.input;
            viewData.ingredients.input = sharedData.ingredients.input;
            viewData.prepMethod.input = sharedData.prepMethod.input;
            viewData.description.input = sharedData.description.input;
            viewData.foodImageURL.input = sharedData.foodImageURL.input;
            viewData.category.input = sharedData.category.input;
            viewData.category.input = sharedData.category.input;
            viewData[selected] = true;
            viewData.msgs = msgs;



        }

        this.loadPartials({
            navbar: '../views/partials/navbar.hbs',
            notifications: '../views/partials/notifications.hbs',
            footer: '../views/partials/footer.hbs',
        }).then(function() {
            this.render('../views/app/share.hbs', viewData).swap()
        })
    }


    postShareRecipe() {
        console.log('[postShareRecipe] Validate the Recipe Form');
        let { meal, ingredients, prepMethod, description, foodImageURL, category } = this.params;
        formData = { meal, ingredients, prepMethod, description, foodImageURL, category }


        let isValid = createValidation(formData);

        if (isValid) {

            //Ingredients Array
            formData.ingredients = ingredients.split(', ');
            const titleIngredients = formData.ingredients.filter((item, index) => index < 4);


            const [categorySelection, categoryURL] = category.split('..***..');
            let likes = [sessionStorage.getItem('userId')];



            const data = { category: categorySelection, categoryImageURL: categoryURL, likesCounter: 1, likes, titleIngredients }
            msgCounter = 0; //reset counter

            let serverData = {...formData, user: sessionStorage.getItem('userId'), ...data }

            //server request
            db.post('recipes', serverData, sessionStorage.getItem('loggedIn')).then(res => {

                //update the local recipes array
                allRecipes.push({...serverData, _id: res._id })

                //display user message
                msgs.push({ msg: 'Loading', class: 'alert-primary' });
                msgs.push({ msg: 'Recipe created successfully!', class: 'alert-success' });

                //send user to home page
                this.redirect('#/');
            })
        } else {
            this.redirect('#/recipes/share');
        }
    }

    getDetails() {
        console.log('[getDetails] Display Recipe Details Layout')

        //locate the selected recipe from the allRecipes array
        const viewRecipe = allRecipes.find(item => item._id.toString() === this.params.id);

        //check if recipe more than 1 like (change text to "likes")
        let hasLikes = false;
        (viewRecipe.likes.length > 0) ? hasLikes = true: hasLikes = false;

        //check if recipe has only 1 like (change text to "like")
        let hasOnlyOneLike = false;
        (viewRecipe.likes.length == 1) ? hasOnlyOneLike = true: hasOnlyOneLike = false;

        viewRecipe.msgs = [];

        //compose the sharedData array
        sharedData = {};
        sharedData.activeUserId = sessionStorage.getItem('userId');
        sharedData.firstname = sessionStorage.getItem('firstname');
        sharedData.lastname = sessionStorage.getItem('lastname');
        sharedData.recipeId = viewRecipe._id;


        //check if the viewer is the same person that created the recipe.
        // If so, hide the like button and show the edit buttons.
        let likeButton;
        let editButtons;
        (viewRecipe.user === sharedData.activeUserId) ? likeButton = true: likeButton = false;
        (viewRecipe.user === sharedData.activeUserId) ? editButtons = false: editButtons = true;

        //compose the object that wiil be passed to the DETAILS view
        const viewData = {...viewRecipe, ...sharedData, homeActive: true, loggedIn, likeButton, editButtons, hasLikes, hasOnlyOneLike }

        //load recipe
        this.loadPartials({
            navbar: '../views/partials/navbar.hbs',
            notifications: '../views/partials/notifications.hbs',
            footer: '../views/partials/footer.hbs',
        }).then(function() {
            this.render('../views/app/details.hbs', viewData).swap()

        })

    }


    getArchive() {
        console.log('[getArchive] Remove Recipe From Database')
        let id = this.params.id;
        console.log('Archive: ' + id)

        //remove/archive the recipe from the database
        db.delete('recipes', id, sessionStorage.getItem('loggedIn')).then(() => {

            //remove/archive the recipe from the allRecipes array
            allRecipes = allRecipes.filter(recipe => recipe._id !== id);

            //return user to the home page
            this.redirect('#/')

            //notify the user
            msgs.push({ msg: 'Your recipe was archived.', class: 'alert-success' });
        })
    }

    getEdit() {
        console.log('[getEdit] Display Edit Recipe Form')
        let id = this.params.id
        let recipetoEdit = allRecipes.find(recipe => recipe._id == id);

        const viewData = {
            homeActive: true,
            editmode: true,
            loggedIn,
            id: recipetoEdit._id,
            likes: recipetoEdit.likes,
            likesCounter: recipetoEdit.likesCounter,
            ...sharedData,
        };

        if (msgCounter > 0) {
            console.log('[getEdit] editmode')
            viewData.meal.input = formData.meal

            viewData.ingredients.input = formData.ingredients;
            viewData.prepMethod.input = formData.prepMethod;
            viewData.description.input = formData.description;
            viewData.foodImageURL.input = formData.foodImageURL;
            viewData.category.input = formData.category;
        } else {
            console.log('[getEdit] regular mode')
            viewData.meal = { input: recipetoEdit.meal }
            viewData.ingredients = { input: recipetoEdit.ingredients.join(', ') }
            viewData.prepMethod = { input: recipetoEdit.prepMethod }
            viewData.description = { input: recipetoEdit.description }
            viewData.foodImageURL = { input: recipetoEdit.foodImageURL }
            viewData.category = { input: recipetoEdit.category }
            viewData.categoryImageURL = { input: recipetoEdit.categoryImageURL }
        }

        viewData.editMode = true;


        //set the dropdown menu with the proper selected category
        const options = {
            'Vegetables and legumes/beans': 'option1',
            'Fruits': 'option2',
            'Grain Food': 'option3',
            'Milk, cheese, eggs and alternatives': 'option4',
            'Lean meats and poultry, fish and alternatives': 'option5'
        }
        const selected = options[recipetoEdit.category];
        viewData[selected] = true;

        this.loadPartials({
            navbar: '../views/partials/navbar.hbs',
            notifications: '../views/partials/notifications.hbs',
            footer: '../views/partials/footer.hbs',

        }).then(function() {
            this.render('../views/app/share.hbs', viewData).swap()
        })

    }

    postEdit() {
        console.log('[postEdit] Post Edit');

        let { meal, ingredients, prepMethod, description, foodImageURL, category, id, likesCounter, likes } = this.params;

        formData = { meal, ingredients, prepMethod, description, foodImageURL, category }

        let isValid = createValidation(formData);

        if (isValid) {
            console.log('[postEdit] Edit isValid')

            msgCounter = 0; //reset counter

            //Ingredients Array
            formData.ingredients = ingredients.split(', ');
            const titleIngredients = formData.ingredients.filter((item, index) => index < 4);


            const [categorySelection, categoryURL] = category.split('..***..');


            //update the form data
            formData.category = categorySelection;
            formData.categoryImageURL = categoryURL;

            const data = { category: categorySelection, categoryImageURL: categoryURL, titleIngredients, likes, likesCounter }
            let serverData = {...formData, user: sessionStorage.getItem('userId'), ...data }

            db.edit('recipes', id, serverData, sessionStorage.getItem('loggedIn')).then(res => {
                msgs.push({ msg: 'Recipe successully updated!', class: 'alert-success' });

                let index = allRecipes.findIndex(recipe => recipe._id == id);
                allRecipes[index] = {...serverData, _id: id }

                this.redirect('#/');
            })
        } else {
            console.log('[postEdit] Edit invalid')
            this.redirect(`#/recipe/edit/${id}`);
        }
    }

    getLike() {
        console.log('[getLike] Validate Like Request')
        let id = this.params.id;
        let userId = sessionStorage.getItem('userId');

        //capture the recipe that is to be liked
        let index = allRecipes.findIndex(recipe => recipe._id == id);

        // check if user has already liked this recipe
        if (allRecipes[index].likes.includes(userId)) {
            console.log('[getLike] User Removed Like');

            //append local copy of the recipe properties (count & id from array)
            allRecipes[index].likesCounter--;
            allRecipes[index].likes = allRecipes[index].likes.filter(id => id != userId);
            msgs.push({ msg: 'You no longer like that recipe.', class: 'alert-success' });

        } else {
            console.log('[getLike] User Added Like');

            //append local copy of the recipe properties (count & id from array)
            allRecipes[index].likesCounter++;
            allRecipes[index].likes.push(userId)

            msgs.push({ msg: 'You liked that recipe.', class: 'alert-success' });

        }

        const viewData = allRecipes[index]

        db.edit('recipes', id, viewData, sessionStorage.getItem('loggedIn')).then(res => {

            //return user to the details page
            this.redirect('#/')

        })
    }




}