import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user';

import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userToken: string;
  roleAs: string;
  
  //Esta variable me permite mostrar ciertos <nav-link> del navBar según si el usuario está o no autenticado.
  isAuth: boolean;
  
  //private url = 'http://localhost:3000/v1/auth';

  constructor( private httpClient: HttpClient ) { 
    this.readToken();
    this.isAuth = this.isAuthenticated();
  }

  readName ():string {
    if( localStorage.getItem('name') ){
      return localStorage.getItem('name');
    } else {
      return '';
    }
  }
  
  getIsAuth (): boolean {
    return this.isAuth;
  }

  //Cerrar sesión
  logout () { 
    localStorage.removeItem('token');
    
    //Borramos el valor del nombre del usuario y el rol
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('gender');
    localStorage.removeItem('fullName');
    localStorage.removeItem('id');

    this.roleAs = '';

    //Cambiamos el valor de isAuth a true porque el usuario acaba de cerrar sesión
    this.isAuth = false;

  }

  //Iniciar sesión
  login(user: UserModel) {

    const authData = {
      email: user.email,
      password: user.password,
    };
    
    return this.httpClient.post(
      `${ url }auth/login`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['tokens']['access']['token'] );
        this.saveRole( resp['user']['role'] );
        this.saveId(resp['user']['id']);
        
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
      `${ url }auth/register`,
      authData
    ).pipe(
      map( resp => {
        
        //Guardamos el token de la respuesta
        this.saveToken( resp['tokens']['access']['token'] );
        this.saveRole( resp['user']['role'] );
        this.saveId(resp['user']['id']);
        
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

    //A la fecha actual se le suman dos horas, que es el tiempo de expiración del token y se almacena en el localStorage
    let today = new Date();
    today.setSeconds(7200);
    localStorage.setItem( 'expira', today.getTime().toString() );
  }

  private saveRole ( role: string ) {
    this.roleAs = role;
    localStorage.setItem('role', role);
  }

  private saveId ( id: string ) {
    localStorage.setItem('id', id);
  }

  getRole() {
    this.roleAs = localStorage.getItem('role');
    return this.roleAs;
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
    
    if ( !localStorage.getItem('token') ) {
      return false;
    }
    
    // if ( this.userToken.length < 2 ) {
    //   return false;
    // }

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
