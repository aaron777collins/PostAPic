# COMP2707Project
A small website using php for the backend and react for the frontend
[Link to Website](https://colli11s.myweb.cs.uwindsor.ca/COMP-2707-W23/project/frontend/build/)

Run `docker-compose up -d` in the base directory to run the backend. Use `cd frontend` in another terminal to go to the frontend directory and then run `npm start` for a frontend dev server.

Optionally, you can run `npm run build` to build a production version of the frontend. You can serve the `build/` directory within frontend to run a production frontend (Ex. `npx serve -s build`). However, you may want to adjust the default address in app, etc. if you aren't serving on the UWindsor server.
