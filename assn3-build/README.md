## Fix API's:
- [x] I want to be able to see all the movies in the catalogue
- [x] I want to be able to find more detailed information about a movie
- [x] I want to have at least one way to filter the movies in the catalog
    - [x] i.e., Maybe I want to find similar movies (i.e., "other romances", "other movies by Ghibli")
- [x] I want to be able to search for a specific movie
- [x] I want to "quick add" a movie to my plan-to-watch list from the main page, with no notes and a default priority
- [x] I want to see all the movies on my watch list sorted by priority
- [x] I want to be able to update the priority of a movie on my watchlist
- [x] I want to be able to mark a movie as watched once I've seen it (which should remove it from my watch list and place it on the completed list)
- [x] I want to be able to add a score onto a movie that I've seen (either when moving it to completed or later)

- [X] I want to be able to see all my finished movies sorted by score or date watched (developer's choice) 
- [x] I want to be able to update the number of times I've watched a movie on my completed list if I've watched it again
- [x] I want to be able to remove things from my planning list even if I don't end up watching it (e.g., I added the wrong one, or I changed my mind, etc)

COMPLETED ALL OF THEM!!! :DDDD


## Important to do:
- [x] Create a login/Sign up page (w/ forgot password)
  - [x] Make it so that (no need to input API for):
    - [x] Quick Add to WatchList (from homepage)
    - [x] No need to enter Api key for toWatchList
    - [x] No need to enter APi key for CompletedWatchList
  - [x] Make sure that the completed list entries api has movies detail in there: "so that when you click movie details you can actually see the movies in there"



- [ ] Make it look Pretty (css) -- try to use good UX practice 
  
## Extra stuff to do:
- [ ] Create more filters:
  - [ ] Production company filter

## Remember
 1. 3430_users (userId, username, email, password, api_key, 	api_date), 2. 3430_toWatchList (watchListId, userId, movieid, priority, notes), 3. 3430_completedWatchList (completedId, userId, movieid, rating, notes, date_initially_watched, date_last_watched, times_watched), 4. 3430_movies (id, title, tagline, overview, 	original_language, poster, runtime, vote_average, vote_count, 	budget, revenue, homepage, release_date)

## Assignment 2 (DID IT!!! EXCEPT NOTING):
- [x] **DELETE** `/towatchlist/entries/{id}` - Requires an API key and movieID; deletes the appropriate movie from the user's watchlist. 
- [x] **DELETE** `/completedwatchlist/entries/{id}` - Requires an API key and movieID; deletes the appropriate movie from the completedWatchList. 
    - DELETS USIGN COMPLETEDWATCHLIST ID!!!!! NOT MOVIE ID (doesn't matter what the movie_id is...)

### EXTRA STUFF
- [X] I want to be able to see all my finished movies sorted by score or date watched (developer's choice) 
- WE DID => FINISHED MOVIES SORTED BY SCORE (IN COMPLETED WATCHLIST!!!)

## User API
User 4: 7f2909fd2970488b3c0a19da2eb803e8
User 1: 900a1e2ba98c92db4d9c4b46af142a8f

