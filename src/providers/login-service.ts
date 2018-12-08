import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

    constructor() { }


    /*  Login Universal Data
    ==============================*/
    getDataForLoginFlat = () => {
        let data = {
            "logo": "assets/images/brohders-logo.png",
            "btnLogin": "Ingresar",
            "txtUsername" : "Usuario",
            "txtPassword" : "Contraseña",
            "txtForgotPassword" : "Forgot password?",
            "btnResetYourPassword": "Reset your password",
            "txtSignupnow" : "Don't have an account?",
            "btnSignupnow": "Signup now",
            "title": "Bienvenido,",
            "subtitle": "favor ingrese a su cuenta.",
            "errorUser" : "Usuario es requerido",
            "errorPassword" : "Contaseña es requerida"
        };
        return data;
    };

}
