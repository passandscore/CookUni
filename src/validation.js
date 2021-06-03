export const loginValidation = ({ username, password }) => {
    console.log('[Validation] Perform Login Validation')

    sharedData = { username: {}, password: {} }

    if (!username) {
        msgs.push({ msg: 'Username is required', class: 'alert-danger' });
        console.log('[Validation] Username is required');

        sharedData.username.invalid = true;

    } else if (!validator.isLength(username, { min: 3 })) {
        msgs.push({ msg: 'Username should be at least 3 characters', class: 'alert-danger' })
        console.log('[Validation] Invaild character (a-z, A-Z, 0-9, _ . -) only');

        sharedData.username.invalid = true;
    } else {
        sharedData.username.valid = true;
    }

    if (!password) {
        msgs.push({ msg: 'Password Field is required', class: 'alert-danger' });
        console.log('[Validation] Password Field is required');

        sharedData.password.invalid = true;
    } else if (!validator.isLength(password, { min: 6, max: 15 })) {
        msgs.push({ msg: 'Password should be 6-15 characters', class: 'alert-danger' })
        console.log('[Validation] Password should be 6-15 characters');

        sharedData.password.invalid = true;
    } else {
        sharedData.password.valid = true;
    }

    let isValid = msgs.length === 0;
    return isValid;
}


export const signupValidation = ({ firstname, lastname, username, password, password2 }) => {
    console.log('[Validation] Perform Signup Validation')

    loginValidation({ username, password });
    sharedData.password2 = {};
    sharedData.firstname = {};
    sharedData.firstname.name = firstname;
    sharedData.lastname = {};
    sharedData.lastname.name = lastname;


    if (!firstname) {
        msgs.push({ msg: 'First name field is required', class: 'alert-danger' })
        console.log('[Validation] First name field is required');

        sharedData.firstname.invalid = true;
    } else {
        sharedData.firstname.valid = true;
    }

    if (!lastname) {
        msgs.push({ msg: 'Last name field is required', class: 'alert-danger' })
        console.log('[Validation] Last name field is required');

        sharedData.lastname.invalid = true;
    } else {
        sharedData.lastname.valid = true;
    }

    if (!password2) {
        msgs.push({ msg: 'Confirmed Password Field is required', class: 'alert-danger' })
        console.log('[Validation] Confirmed Password Field is required');
        sharedData.password2.invalid = true;
    } else if (!validator.equals(password, password2)) {
        msgs.push({ msg: 'Password not matching', class: 'alert-danger' })
        console.log('[Validation] Password not matching');

        sharedData.password2.invalid = true;
    } else {
        sharedData.password2.valid = true;
    }
    let isValid = msgs.length === 0;
    return isValid;
}

export const createValidation = ({ meal, ingredients, prepMethod, description, foodImageURL, category }) => {
    console.log('[Validation] Perform New/Edit Recipe Validation')
    msgCounter = 0; //reset counter
    const ingredientsArray = ingredients.split(', ');
    const [categorySelection, categoryURL] = category.split('..***..');

    if (!meal) {
        sharedData.meal = { invalid: true, valid: false, msg: 'Provide Meal' }
        msgCounter++;
        console.log('[Validation] Provide Meal');

    } else if (!validator.isLength(meal, { min: 4 })) {
        sharedData.meal = { invalid: true, valid: false, msg: 'Meal should be at least 4 characters' };
        console.log('[Validation] Meal should be at least 4 characters');

        msgCounter++;
    } else {
        sharedData.meal = { valid: true, invalid: false, input: meal }
    }

    if (!ingredients) {
        sharedData.ingredients = { invalid: true, valid: false, msg: 'Provide ingredients' }
        console.log('[Validation] Provide ingredients');

        msgCounter++;

    } else if (ingredientsArray.length < 2 || ingredientsArray[1] === ',') {
        sharedData.ingredients = { invalid: true, valid: false, msg: 'You need to provide at least 2 ingredients seperated with a comma and a space' };
        console.log('[Validation] You need to provide at least 2 ingredients seperated with a comma and a space');

        msgCounter++;
    } else {
        sharedData.ingredients = { valid: true, invalid: false, input: ingredients }
    }

    if (!prepMethod) {
        sharedData.prepMethod = { invalid: true, valid: false, msg: 'Provide preparation Method' }
        console.log('[Validation] Provide preparation Method');
        msgCounter++;

    } else if (!validator.isLength(prepMethod, { min: 10 })) {
        sharedData.prepMethod = { invalid: true, valid: false, msg: 'Preparation method should be at least 10 characters' };
        console.log('[Validation] Preparation method should be at least 10 characters');
        msgCounter++;
    } else {
        sharedData.prepMethod = { valid: true, invalid: false, input: prepMethod }
    }

    if (!description) {
        sharedData.description = { invalid: true, valid: false, msg: 'Provide a description' }
        console.log('[Validation] Provide a description');
        msgCounter++;

    } else if (!validator.isLength(description, { min: 10 })) {
        sharedData.description = { invalid: true, valid: false, msg: 'Description method should be at least 10 characters' };
        console.log('[Validation] Description method should be at least 10 characters');
        msgCounter++;
    } else {
        sharedData.description = { valid: true, invalid: false, input: description }
    }

    if (!foodImageURL) {
        sharedData.foodImageURL = { invalid: true, valid: false, msg: 'Provide a food imageURL' }
        console.log('[Validation] Provide a food imageURL');
        msgCounter++;

    } else if (!validator.isURL(foodImageURL)) {
        sharedData.foodImageURL = { invalid: true, valid: false, msg: 'Food URL should start with "http://" or "https://"' }
        console.log('[Validation] Food URL should start with "http://" or "https://"');
        msgCounter++;
    } else {
        sharedData.foodImageURL = { valid: true, invalid: false, input: foodImageURL }
    }

    if (categorySelection === 'Select category...') {

        sharedData.category = { invalid: true, valid: false, msg: 'Provide category' }
        console.log('[Validation] Provide category');

        msgCounter++;
    } else {
        sharedData.category = { valid: true, invalid: false, input: categorySelection, url: categoryURL }
    }

    sessionStorage.setItem('categorySelection', categorySelection);
    let isValid = msgCounter;

    (isValid > 0) ? isValid = false: isValid = true;
    return isValid;

}