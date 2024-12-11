# MySchoolApp
The MySchoolApp is the client application for the MySchool project. This project is a platform (website) designed for a school on which applicants can submit applications, parents can view the grades of their children, teachers can submit assignments and many more.

## How to run
- Download the MySchoolApp from this repositoty.
- Open the terminal and navigate to the directory in which you just downloaded the MySchoolApp.
- run `npm install`.
- run `ng serve`.

Before running the application you should check the `restUrlBase` property located in (root)/src/environments/environment.development.ts. This variable determines the base of the URL for the requests to the MySchoolServer. The default is: `restUrlBase: 'http://localhost:3000'`. If you change the port on the server, for example, you must change this value accordingly. If you change the port of the Angular server, you must edit the `origin` variable on the surver - the defaults are `'http://localhost:5555', 'http://localhost:4200'`.

In order to use this application you must also install the [MySchoolServer](https://github.com/alexandrov5433/MySchoolServer). More on the server in the given repository.

## About
### Code and libraries
This is an application built in Angular v19. The extra packages used are:
- [ngx-cookie-service](https://www.npmjs.com/package/ngx-cookie-service) - Used for monitoring the presence of the cookie 'user', the value of which is the JWT used for authentication on the MySchoolServer, sent with every request. It is also used to keep the user logged in after the page is refrashed. On log in the user id and authorization status are saved in the local storage under the key `userData`. They are cleared on log out. If in the meen time the user refreshes the page, the  life cycle hook ngOnInit (OnInit) in the `main` component checks if there is a cookie `user` and sends `true` or `false` to the `UserService`. Based on the boolean value the `UserService` gets the user data from the local storage and resets the needed private properties. This way the user stays logged in after the page refrash and the next request to the server is authorized.
- Angular Materials (provided in Angular) - The `MatSnackBar` was used for displaying informative and error messages to the user. E.g. when trying to log in with a wrong password or when successfully adding a grade.

The folder structure follows the layout of the website.
There are the core compnents - `header` and `main`. The `header` holds the navigation bar and the rest is renderd in the `main` component.
In the `basic` folder you can find all components for the home, about, contact, FAQ and forms and documents pages.
All profile-related components are located in the `profile` folder
In the `application` folder are placed the components user for reviewing applications.
In the `account` folder are the login, register, apply (for submitting applications, as it is a form of registration) and add-children (for parents to add students as children; the connection is made between the `User` documents, which are also the main documents for the account, that is why this component is here).
In the `subjects` folder are subject-related components, for example the subjects overview `all-subjects` component.
All services are placed together in the `services` folder. The same goes for the TypeScript types - they are in the `types` folder.
Utilities can be found in the `util` folder: authorization guards, input validator functions, Date time parsing functions, server message parser and a mimetype library for finding the appropriate file extention when the user is downloading a file.

### Functionality
There are 4 types of users for this application: 
- teachers
- students
- parents
- guests (non-users)

Based on their authorization they have access to different parts of the website and can execute different tasks.
#### Access
- Guests have access to the following pages: home, about, contact, faq, form & documents, all subjects (overview) and subject details (basic details with no functionality).
- All users have a profile page with details and documents, where they can remove and add such.
- Students can join subjects and thus view the whole content, download materials, publish solutions for assignments and more.
- Teachers can create assignments in the subjects created by them, make publications, view submitions for the assignments, post materials and more. They can grade students (in their profiles). They have access to the pending applications (of applicants who could become students) and can accept or reject them. Teachers can also edit the FAQ page.
- Parents can view the profiles of their children (students) and add other students as their children.
#### Registration
Parents and teachers create accounts through the `Register` page. Parents can register after their child has been acceped and is a student because they need the `Parental Authentication Code` found in the `Details` page of the studets profile. Teachers use as authorization code the same one defined on the MySchoolServer - the default is `123`. 
