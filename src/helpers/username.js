export default function username(viewData) {
    viewData.firstname = sessionStorage.getItem('firstname');
    viewData.lastname = sessionStorage.getItem('lastname');
}