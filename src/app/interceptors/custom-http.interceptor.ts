import { HttpInterceptorFn } from "@angular/common/http";
import { inject, Inject } from "@angular/core";
import { MatSnackBar, MatSnackBarLabel } from "@angular/material/snack-bar";
import { tap } from "rxjs";

export const CustomHttpInterceptor: HttpInterceptorFn = (req, next) =>{
    let request = req;
    const snackBar= inject(MatSnackBar)
    return next(request).pipe(
        tap({
            next: () => null,
            error: () => {
                snackBar.open('Oops! Something went wrong', undefined,{
                    duration: 3000,});
            },
        })
    );
};