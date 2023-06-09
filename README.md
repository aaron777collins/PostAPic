# PostAPic
A small website using php for the backend and react for the frontend

[Link To The Website](https://colli11s.myweb.cs.uwindsor.ca/COMP-2707-W23/project/frontend/build/)

## Running The Project
Run `docker-compose up -d` in the base directory to run the backend (run `docker-compose build` before your first run). Use `cd frontend` in another terminal to go to the frontend directory and then run `npm start` for a frontend dev server. You will need to run `npm install` the first time this
project is run.

*Note: On your first run, you should navigate to [http://localhost:8080/createtables.php](http://localhost:8080/createtables.php) to initialize your tables.*

*(On your first run, don't forget to copy the '.env copy' and '.env example' files to be a '.env' file in their respective directories)*

Optionally, you can run `npm run build` to build a production version of the frontend. You can serve the `build/` directory within frontend to run a production frontend (Ex. `npx serve -s build`). However, you may want to adjust the default address in app, etc. if you aren't serving on the UWindsor server.

## Testing
These tests are written using selenium web driver.
Launch the project as mentioned above and then in a new terminal
`cd frontend` and run `npm test`.

*Note: You may
also need to edit your Selenium settings to allow
file uploads/urls*.
