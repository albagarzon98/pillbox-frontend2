import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string;
  userToken: string;
  name: string;
  
  //Esta variable me permite mostrar ciertos <nav-link> del navBar según si el usuario está o no autenticado.
  isAuth: boolean;
  
  //private url = 'http://localhost:3000/v1/auth';

  constructor( private httpClient: HttpClient ) { 
    this.url = 'http://localhost:3000/v1/auth';
    this.readToken();
    this.isAuth = this.isAuthenticated();
  }

  readName ():string {
    if( localStorage.getItem('name') ){
      this.name = localStorage.getItem('name');
    } else {
      this.name = '';
    }
    return this.name;
  }
  
  getIsAuth (): boolean {
    return this.isAuth;
  }

  //Cerrar sesión
  logout () { 
    localStorage.removeItem('token');
    
    //Borramos el valor del nombre del usuario
    localStorage.removeItem('name');
    
    //Cambiamos el valor de isAuth a true porque el usuario acaba de cerrar sesión
    this.isAuth = false;

    console.log(`Valor de isAuth despues del logout del servicio: ${this.isAuth}`);
  }

  //Iniciar sesión
  login(user: UserModel) {

    const authData = {
      email: user.email,
      password: user.password,
      //role: user.role
    };
    
    return this.httpClient.post(
      `${ this.url }/login`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['tokens']['access']['token'] );
        
        //Cambiamos el valor de isAuth a true porque el usuario acaba de loguearse
        this.isAuth = true;
        
        //Guardamos el valor del nombre del usuario para mostrarlo en el Navbar
        localStorage.setItem('name', resp['user']['name']);

        return resp;
      })
    );
   }
  
  //Registrar nuevo usuario
   signIn( user: UserModel ){

    const authData = {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role
    };

    return this.httpClient.post(
      `${ this.url }/register`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['tokens']['access']['token'] );
        
        //Cambiamos el valor de isAuth a true porque el usuario acaba de crear su cuenta
        this.isAuth = true;
        
        //Guardamos el valor del nombre del usuario para mostrarlo en el Navbar
        localStorage.setItem('name', resp['user']['name']);

        return resp;
      })
    );
  }

  //Almacenar el token
  private saveToken ( idToken: string ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    //A la fecha actual se le suma media hora, que es el tiempo de expiración del token y se almacena en el localStorage
    let today = new Date();
    today.setSeconds(1800);
    localStorage.setItem( 'expira', today.getTime().toString() );

  }

  //Leer el token
  readToken () {

    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;

  }

  isAuthenticated(): boolean {

    // console.log('Valor del token del login: ' + this.userToken);
    // console.log('Valor del token del local Storage: ' + localStorage.getItem('token'));
    
    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expires = Number(localStorage.getItem('expira'));
    const expiresDate = new Date();
    expiresDate.setTime(expires);
    
    if ( expiresDate > new Date() ) {
      return true;
    } else {
      return false;
    }
  }
}
