# Assignment 3 - 3430 
By Shelmah & Batool Kazmi (0810583)
#### API Keys so that you can test completed watch list and towatchlist
# Shelmah
- e9565ada8f7fd1446156bd80c8e328cd4ed543ef
- aba017fc6876149ca1a405e9eb27236af6e83662

# Note about this assignment:
- Though, we had started early, we spend alot of time trying to connect to one database, this eventually lead us to change alot from assignmnet 2 but still we weren't that successful. So, for now, Batool's database has all the 4000 movies while, Shelmah's database has the CompletedWatchList & ToWatchList. 

# Testing 
## Minimal Requirements 
- [x] I want to be able to **see all the movies** in the catalogue

- [x] I want to be able to **find more detailed information about a movie**

- [x] I want to have at least one way to filter the movies in the catalog
  - i.e Maybe I want to find similar movies (i.e. "other romances", "other movies by Ghibli")


- [x] I want to be able to **search for a specific movie**



- [x] I want to "quick add" a movie to my plan-to-watch list from the main page, with no notes and a default priority
- [x] I want to see all the movies on my watch list sorted by priority
- [x] I want to be able to update the priority of a movie on my watchlist

- [ ] I want to be able to mark a movie as watched once I've seen it (which should remove it from my watch list and place it on the completed list)
- [x] I want to be able to add a score onto a movie that I've seen (either when moving it to completed or later)
- [x] I want to be able to see all my finished movies sorted by score or date watched (developers choice)
- [x] I want to be able to update the number of times I've watched a movie on my completed list if I've watched it again
- sorted by rating

- [ ] I want to be able to remove things from my planning list even if I don't end up watching it (e.g., I added the wrong one, or I changed my mind, etc)

### Bonus Stuff

- Pagination (allowed me to add all 4000 movies in the movie list!)
- Used Matt's SQL table to find different genres in the movie list (Used many joins)

### Testing starts here

#### See all the movies in catalogue.

![All_movies_in_catalogue_zoomed_out](./Screenshot%202024-07-31%20at%206.54.57 PM.png)

![All_movies_in_catalogue_zoomed_in](./Screenshot%202024-07-31%20at%206.58.19 PM.png)

#### Find more detailed information about a movie

![Movie_details](./Screenshot%202024-07-31%20at%207.26.51 PM.png)

#### Filters

Rating
![Rating_testing](./Screenshot%202024-07-31%20at%207.31.59 PM.png)
Genre
![Genre_testing](./Screenshot%202024-07-31%20at%207.32.56 PM.png)

Search for a specific movie
![Title_testing](./Screenshot%202024-07-31%20at%207.30.50 PM.png)

#### Quick add

Click the quickwatch button
![QuickAddfeature1](./Screenshot%202024-07-31%20at%207.40.22 PM.png)
Enter the api key
![QuickAddfeature2](./Screenshot%202024-07-31%20at%207.40.32 PM.png)
It is then added to the user's to watchlist
![QuickAddfeature3](./Screenshot%202024-07-31%20at%207.47.52 PM.png)

#### Movies on my watch list sorted by priority

![To_watch_list_movies](./Screenshot%202024-07-31%20at%207.54.24 PM.png)

#### Update the priority of a movie on my watchlist

Was initially
![Update_priority](./Screenshot%202024-07-31%20at%207.57.33 PM.png)
Then changed to
![Update_priority](./Screenshot%202024-07-31%20at%207.57.39 PM.png)

#### I want to be able to mark a movie as watched once I've seen it

Click the mark as watched button
![Mark_as_watched](./Screenshot%202024-07-31%20at%207.59.49 PM.png)
Then enter a rating
![Mark_as_watched2](./Screenshot%202024-07-31%20at%207.59.58 PM.png)
Then on submit it is deleted from to watch list
![Mark_as_watched3](./Screenshot%202024-07-31%20at%208.00.06 PM.png)
Then inserted to completed watch list
![Mark_as_watched4](./Screenshot%202024-07-31%20at%208.00.15 PM.png)

#### Add a score onto a movie that I've seen 

Was initially
![Update_score](./Screenshot%202024-07-31%20at%208.07.02 PM.png)
Then changed to
![Update_score2](./Screenshot%202024-07-31%20at%208.07.08 PM.png)

#### All my finished movies sorted by rating

![Completed_watchlist](./Screenshot%202024-07-31%20at%208.09.52 PM.png)

#### Update the number of times I've watched a movie

 Was initially
 ![Update_times_watch](./Screenshot%202024-07-31%20at%208.11.28 PM.png)
 Then changed to
 ![Update_times_watched](./Screenshot%202024-07-31%20at%208.11.32 PM.png)

#### Remove things from my planning list

![Removed](./Screenshot%202024-07-31%20at%208.15.39 PM.png)

![Removed2](./Screenshot%202024-07-31%20at%208.15.44 PM.png)

#### Pagination

![Page1](./Screenshot%202024-07-31%20at%208.22.44 PM.png)
![Page2](./Screenshot%202024-07-31%20at%208.22.49 PM.png)
![Page3](./Screenshot%202024-07-31%20at%208.22.53 PM.png)
