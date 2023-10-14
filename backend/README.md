# Backend

The backend api of the Website Monitoring application.

## General Flow
 - Users add Websites: `POST /websites`
 - Each Website model has a `getChange()` method that compares the current state of the website with its previous state using `changedFields()` method
    - Each website state consists of: `loadTime`, `status`, `content`.
        - `content` is the HTML body content of the website (it excludes all the script, style and other utility tags and their content).
    - States are also saved into database.
    - `changedFields()`: uses `DIFFERENCE_THRESHOLD` environment variable (default 0.1 = 10%) as a threshold to determine whether a state change has happened or not (e.g. did the load time change by > 10%). If yes, it returns a list of changed fields.
 - `getChange()` of every Website is being called using a cron-job scheduled to run using the `SCAN_CRON_EXPRESSION` environment variable.
 - If any change is detected within the `getChange()` method, a new Change object is created in the database.
    - Change keeps: `currentState`, `previousState`, `changedFields` (i.e. `content`, `loadTime`, `status`)
 - In the `pre-save` hook of the Change model, which is called before saving a new Change into database, a `change` event gets emitted using the `changeEmitter` object.
    - `changeEmitter` is an EventEmitter object that is responsible to inform listeners of a new Change being detected.
 - In the `app.ts` file, a listener has been added to the `changeEmitter` to detect any new Change being saved to database. This listener utilizes Notifier classes to send Notifications (SMS, Email) to users.

 ### Extra
  - Each user can utilize the `POST /watch-lists` endpoint to add a Website to its WatchList.
    - This WatchList can be later used by the Notifier classes to notify users of any change that occurred on any website that they have added to their WatchList.

## Environment Variables

 - `PORT`: The port on which the app is listening.
 - `DIFFERENCE_THRESHOLD`: The difference threshold that determines whether a change has occurred.
 - `SCAN_CRON_EXPRESSION`: The schedule of the cron-job that gets the new state of every website and detects changes.


## How to run

 - `$ npm install`
 - `$ npm start`