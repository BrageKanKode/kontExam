#About
This is solution of 48 hours exam in Webutvikling og API-design.

##Rules:
* New visitors can view the auction site
* To bid or add your own auction, you must create a user
* You cannot bid on your own auctions
* You can delete or mark your own auctions, but not others

#Exam reflections

It was not specified if there should be a difference in original price and current bid, so i added them both. 
It was also not specified if a bid could be lower than the asking price either, so i assumed it would be allowed to bid lower than the asking price, as you can in real life.

##Running the application
First we have to run `yarn install` to install needed dependencies.

After installing of dependencies is complected `yarn start` is used to start website with server. Website is found at http://localhost:8080/

###Default data
The app starts with 3 auctions that are being created on server startup. It was a good number that didn't take a lot of devolopment time to make up, and served its point.


##Requirements

#####Technical requirements
I have finished R1, R2 and R3, but not R4 or R5

#####Application requirements
I have finished T1, T2, T3 and T4. I did not start on T5, as i had difficulties with the testing.


#####Testing requirements
I have 57.29% testing coverage across all files when running `yarn test`


##REST API
* POST /api/auctions
* GET /api/auctions/:id
* DELETE /api/auctions/:id
* POST /api/auctions
* PUT /api/auctions/:id
* All /api/auctions/*
* POST /login
* POST /signup
* POST /logout
* GET /user

#####Note:
There are no known bugs or issues


