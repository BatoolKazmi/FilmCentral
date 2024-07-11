[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Q5nhJWay)
# COIS 3430 - Assignment #3

For this assignment you are going to build a React Front-end to make use of your API from assignment #2. Due to the remaining time in the semester, and the fact that I know everyone is very busy, you are not required to complete front-end interfaces for all the endpoints you completed in assignment #2. Below I've provided an minimal set of required functionality. The architecture/functionality choices you make are part of the process, so rather then listing requirements I've provided a simple set of _user stories_ that identify things I'd "like" to do with your app. You can complete additional functionality (things you'd like to be able to do) for bonus marks (up to 15% of the assignment total), and have a more comprehensive app at the end if you want to use it as a portfolio piece.

## Partner Work

To start off, just a quick reminder that you can choose to work on this assignment with a partner (if you want). Choose one Git repo to work out of (and the owner of the repo should invite the other person to collab). Whoever's repo you choose to use should necessary links on Blackboard, letting me know the repo to mark and where to access it on Loki, you must also include the name of your partner. The other person should just submit the name of their partner.

## A Note About Authentication

In a real application you would not what we did in assignment #2 where your authentication logic had SSR pages and everything else was API. Typically your authentication would also be API based. Also, in many situations you wouldn't use an API key for authentication (just for rate-limiting), you would use OAuth tokens instead.

However there requirements were designed to avoid bunch of complexity issues with Oauth (and largely, because I wanted you to practice some php form processing to go with the last couple of lectures in that section). It does however introduce some weirdness for assignment 3, because if the user authenticates themselves with php, how do you transfer that information to your React front-end?

So you've got a couple of options:

- The simplest (and very brute force approach) would be to pick one API key out of your database and hardcode it into you front-end. It would mean you're app would only ever work for that one user, but if you only care about the marks not the finished product, it would be simplest (and won't affect your mark in anyway since you are marked on that login in A2 anyway).
- If you want a fulling functioning app in the end, the better approach would be to move your login logic to an API endpoint that accepts the username/password and returns the api key (then all your other request could continue to use the api key and your existing endpoints would work just fine). Since the logic is already written (and functioning), it would be minimal work to move it to an endpoint instead, which would allow you to have an authentication component in your Front-End.

## A Note About the Movie List

- Something I didn't really think all the way through in Assignment #2 was volume of data associated with the list of movies. You don't want to display 4000 movies on the screen all at once.
- You can include some sort of pagination as an additional feature, or you can simply limit the number of movies that your /movies end point returns so that you just have a smaller set of movies in your app.
- If you didn't already, you may also want to limit that api to only returning a couple of columns rather then everything. That main page is probably only going to display titles and posters and maybe a rating or something (the user would go to an individual movie page to see all the details). You don't have to return everything if you aren't going to use it.

## A Couple of Technical Requirements

- **Make sure to exclude your react build folder from syncing to Loki.** (You could choose to work entirely outside the courses directory structure for the build part of this assignment)
- You can use the API in your A2 folder (you don't need to copy it into A3)
- You are building an Single Page Application and should use React Router for all necessary routing. You should have separate routes for different views. You should also use path variables and url parameters as part of your routes where appropriate.
  - Keep in mind that React Router isn't installed by default when you use Vite to make a react app. You will need to `npm install` it (see lecture notes for details)
- You must build and deploy your finished application to Loki when your done.
- You will need to add a CORS header to your JSON responses in your API from A2 in order to be able to make API requests from your local app. You can see an example of this in the API I provided you for Lab 8.
- It is fine to make additional changes to your API end points if it suits your needs

## Minimal Requirements

**Reminder**: The architecture/functionality choices you make are part of the process (and grade), so rather then listing requirements I've provided a simple set of _user stories_ that identify things I'd "like" to do with your app. You can complete additional functionality (things you'd like to be able to do) for bonus marks (up to 15% of the assignment total), and have a more comprehensive app at the end if you want to use it as a portfolio piece.

### User Stories

- I want to be able to see all the movies in the catalogue
- I want to be able to find more detailed information about a movie
- I want to have at least one way to filter the movies in the catalog
  - i.e Maybe I want to find similar movies (i.e. "other romances", "other movies by Ghibli")
- I want be able to search for a specific movie
- I want to "quick add" a movie to my plan-to-watch list from the main page, with no notes and a default priority
- I want to see all the movies on my watch list sorted by priority
- I want to be able to update the priority of a movie on my watchlist
- I want be able to mark a movie as watched once I've seen it (which should remove it from my watch list and place it on the completed list)
- I want to be able to add a score onto a movie that I've seen (either when moving it to completed or later)
- I want to be able to see all my finished movies sorted by score or date watched (developers choice)
- I want to be able to update the number of times I've watched a movie on my completed list if I've watched it again.
- I want to be able to remove things from my planning list even if I don't end up watching it (e.g., I added the wrong one, or I changed my mind, etc)

Anything beyond this would be considered extra and contribute to bonus marks. What would you like your application to do?

## Submission

- Make sure to build and deploy your finished app to Loki in the assn3 folder (just the contents of the dist folder).
- Put all your testing screenshots in the _testing_screenshots_ folder and then compile them all, well labelled, into the _README.md_ file in the testing_screenshots folder.
- Make sure your remote Git repo is up-to-date
- Submit a link to your live front-end, plus a link to your git repo to Loki.
