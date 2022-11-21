### Model Aplikasi PERPUSTAKAAN
![ERD Perpustakaan](https://user-images.githubusercontent.com/107734134/202962923-bb7289f8-36dd-410e-88c6-851d425e0e8d.png)


### Installation

Installation project - manual

- clone project `git clone https://github.com/irvantaufik28/backend-test-case.git`
- add node modules `npm install`
- rename file .env.example to .env
- configuration db in file .env
- create db `sequelize db:create`
- migrate table `sequelize db:migrate`
- fill the table with dummy data `sequelize db:seed:all`
- npm run start-dev

test each endpoint in swagger

- enter swagger : `localhost:3000/docs` 
- login and get token  
- add token in authorization (in accordance auth)
- testing all endpoint


### Entity

- Admin
- Books
- Borrow
- BorrowDetails
- Member
- Penalty

