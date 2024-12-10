import { inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";

function allUsers() {
    const userService = inject(UserService);
    const router = inject(Router);
    if(userService.isUserLoggedIn) {
        return true;
    }
    router.navigate(['/home']);
    return false;
}

function guestOnly() {
    const userService = inject(UserService);
    const router = inject(Router);
    if(userService.isUserLoggedIn) {
        router.navigate(['/home']);
        return false;
    }
    return true;
}

function teacherOnly() {
    const userService = inject(UserService);
    const router = inject(Router);
    if(userService.isUserLoggedIn && userService.userAuthStatus === 'teacher') {
        return true;
    }
    router.navigate(['/home']);
    return false;
}

function parentOnly() {
    const userService = inject(UserService);
    const router = inject(Router);
    if(userService.isUserLoggedIn && userService.userAuthStatus === 'parent') {
        return true;
    }
    router.navigate(['/home']);
    return false;
}

function studentAndTeacherOnly() {
    const userService = inject(UserService);
    const router = inject(Router);
    if(userService.isUserLoggedIn) {
        if (['student','teacher'].includes(userService.userAuthStatus)) {
            return true;
        }
    }
    router.navigate(['/home']);
    return false;
}

export const routeGuards = {
    allUsers,
    guestOnly,
    teacherOnly,
    parentOnly,
    studentAndTeacherOnly
};