# Frontend

Use `npm install` to install the requirements and then
start the server using `npm start`

Make sure to go into the base directory and run
`docker-compose up -d` to start the backend. (Run `docker-compose build` before your first run)

You can test the frontend using `npm test` but
your frontend and backend must be running in dev
mode for the tests to complete properly.

*Note: You may
also need to edit your Selenium settings to allow
file uploads/urls*.

*ALSO: On your first run, you should navigate to [http://localhost:8080/createtables.php](http://localhost:8080/createtables.php) to initialize your tables.*
