# Frontend

The Frontend of the Website Monitoring application.

## Functionality

 - Users can Register and Login
 - When a user logs in, they can: 
   - Add new Websites
   - Modify their WatchList
 - View a list of Changes for a particular website:
   - In this list 3 fields for every website is shown if they have changed:
     - Status
     - Load Time
     - Content
   - Changed fields are colored
   - ⭐If the Content has changed, a button will appear that let's the user open a Diff Viewer (like Git) to see changes of the Content between current state and previous state. 



## How to Run

 - `$ npm install --force`
    - Make sure to add the `--force` flag
 - `$ npm run dev`