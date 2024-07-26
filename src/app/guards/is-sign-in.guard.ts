import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isSignIn: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const user = sessionStorage.getItem('user');

    if (user){
        router.navigateByUrl('/');
    }

    return true;
};