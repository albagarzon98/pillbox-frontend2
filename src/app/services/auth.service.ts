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
  //private url = 'http://localhost:3000/v1/auth';
  
  //private apikey = '';



  //Crear nuevo usuario
  // http://localhost:3000/v1/auth/register

  //Login
  // 


  constructor( private httpClient: HttpClient ) { 
    this.url = 'http://localhost:3000/v1/auth';
    this.readToken();
  }

  //Cerrar sesión
  logout () { 
    localStorage.removeItem('token');
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

    console.log('Valor del token del login: ' + this.userToken);
    console.log('Valor del token del local Storage: ' + localStorage.getItem('token'));
    
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
