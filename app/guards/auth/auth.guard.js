import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(router: Router, auth: AuthService) {
    this.router = router;
    this.auth = auth;
  }

  canActivate() {
    return this.auth.auth$
     .take(1)
     .map(authState => !!authState)
     .do(authenticated => {
       if (!authenticated) {
        this.router.navigate(['/login']);
       }
     });
    return false;
  }
}
