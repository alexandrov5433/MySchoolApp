# Development Notes

## Navigation
### Guest Nav
Home  About  Contact  FAQ   Forms & Documents          Register(Parent, Teacher)    Log In(Student, Parent, Teacher)    Apply Now(Student)

### Student Nav
Home  About  Contact  FAQ    Forms & Documents         Subjects(My Subjects, All Subjects)    My Grades   My Profile   Logout

### Parents Nav
Home  About  Contact  FAQ    Forms & Documents         Student Grades    My Profile   Logout

### Teacher Nav
Home  About  Contact  FAQ    Forms & Documents         Subjects(My Subjects, Create Subject, All Subjects)    Students(Pending Applications, All Students)     My Profile   Logout

## Home and other common endpoints
//TODO

## Subjects
Available subject categories:
- English and Literatur
- Mathematics
- Physics
- Biology
- Chemistry
- History
- Physical Education

Student:
- My Subjects (overview) -> Subject Details (id)

Teacher: 
- My Subjects (overview) -> Subject Details (id)
- Create Subject (select one category)
- All Subjects (overview) -> All Subjects (overview; with search?)

### All Subjects (overview; with search?) - Student
A quick JOIN btn is present in each component. If student already participates in a subject of the same category (eg. Math) - no JOIN btn is dispayed for this category (eg. Math).

### Subject Details (id) - Student view
- leading Teacher
- subject name
- subject id
- participating students
- JOIN btn if not paticipant, else LEAVE btn
- announcement (from teacher) board owerview
- asignments board (for participats) - file CRUD before deadline
- download materials (for participats)

### Subject Details (id) - Teacher view
- leading Teacher
- subject name
- subject id
- participating students
- announcement board - CRUD
- asignments board - CRUD
- download materials - CRUD

## Students (Teacher only)
- Pending Applications (overview) -> application details (id)
- All Students (overview) -> student profile (id) -> Student grades (id) CRUD

## Grades
Teacher - CRUD - see "Students" part
Student and Parent - same grades overview for both

## My Profile (Student, Parent and Teacher)
Data:
- first name
- last name
- date of birth
- profile picture
- email
- telephone
- id in system
Owner: CRUD
Non-owner: view only