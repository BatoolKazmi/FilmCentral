### Checklist (overall)

#### Setup and Planning

- [ ] **Project Structure**
  - Decide on the overall structure of your React application.
  - Plan folder organization for components, styles, and utilities.
- [x] **Git Repository**
  - Choose a Git repository to collaborate on (decide who owns the repo and invite collaborators).
  - Ensure both partners have access and understand version control basics.
  
#### A Note About Authentication

- [ ] Authentication (2 ways to do it - there is a note about it)

#### A Note About The Movie List

- [x] You don't want to display 4000 movies on the screen all at once.
  - [ ] Can include some sort of pagination as an additional feature
  - [x] OR you can simply limit the number of movies (limited to 30)
- [ ] You may also want to limit that api to only returning a couple of columns rather then everything.
  - Main Page (display title and posters & mabye rating & etc)

#### A Couple of Technical Requirements

- [x] Make sure to exclude your react build folder from syncing to Loki. 
- [ ] You can use the API in your A2 folder
- [ ] You are building an Single Page Application and should use React Router for all necessary routing.
- [ ] You must build and deploy your finished application to Loki when your done.
- [ ] You will need to add a CORS header to your JSON responses in your API from A2 in order to be able to make API requests from your local app. You can see an example of this in the API I provided you for Lab 8.

```php 
header("Access-Control-Allow-Origin: *"); 
```

#### Minimal Requirements (NO BONUS MARKS)

**User Stories**
- [x???] I want to be able to **see all the movies** in the catalogue
- [x] I want to be able to **find more detailed information about a movie**
- [ ] I want to have at least one way to filter the movies in the catalog
  - i.e Maybe I want to find similar movies (i.e. "other romances", "other movies by Ghibli")

- [x] I want to be able to **search for a specific movie**
- [ ] I want to "quick add" a movie to my plan-to-watch list from the main page, with no notes and a default priority
  - [ ] Add a "quick add" button next to each movie on the main page.
  - [ ] Automatically add the movie to the plan-to-watch list with default settings.

- [ ] I want to see all the movies on my watch list sorted by priority
  - [ ] Display the watch list sorted by priority.
  - [ ] Allow users to view and manage their watch list.

- [ ] I want to be able to update the priority of a movie on my watchlist
  - [ ] Provide an option to edit the priority of movies in the watch list.
  - [ ] Save changes and update the watch list accordingly.

- [ ] I want to be able to mark a movie as watched once I've seen it (which should remove it from my watch list and place it on the completed list)

- [ ] I want to be able to add a score onto a movie that I've seen (either when moving it to completed or later)

- [ ] I want to be able to see all my finished movies sorted by score or date watched (developers choice)

- [ ] I want to be able to update the number of times I've watched a movie on my completed list if I've watched it again

- [ ] I want to be able to remove things from my planning list even if I don't end up watching it (e.g., I added the wrong one, or I changed my mind, etc)


**BONUS**
Do some additional stuff

#### Submission and Presentation

- [ ] **Submission**
  - Prepare for submission according to your course guidelines (submit on time, include required documentation and information).

<!-- 

- Movie List
  - Not includin all 4000 movies on the screen all at once
    - include sort of pagination
    - OR limit number of movies
  - limit api to return a couple of columns rather than everthing
  - Main page (title & posters & maby rating or etc)

- Technical Requirements
  - Exclude react build folder
  - use API in your A2 folder
  - Build an Single Page Application 
  - use React Router
 -->