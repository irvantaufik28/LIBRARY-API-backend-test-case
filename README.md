### Model Aplikasi PERPUSTAKAAN


### Installation

Installation project - manual

- clone project `git clone https://github.com/bimaagung/maju-jaya-platinum-kelompok-1-BEJ.git`
- add node modules `npm install`
- rename file .env.example to .env
- configuration db in file .env
- create db `sequelize db:create`
- migrate table `sequelize db:migrate`
- fill the table with dummy data `sequelize db:seed:all`
- npm run start-dev

test each endpoint in swagger

- enter swagger for customer : `localhost:3000/docs` 
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

