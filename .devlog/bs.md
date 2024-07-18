# Devlog 2: Finally updating a file
High level overview:
- Turning web socket messages into actionable requests (serde)
- applying those changes to the file itself
- Converting the echo ws server into a broadcasting all but one server
  - Note that this omits the use of operational transform; for now
- Explain how delta updates are handled in the frontend App.tsx
- Explain how file loading was implemented (TODO)


The next step is to apply the changes made on the frontend to *some* file on the backend; by a single user. Here is the steps we're going for:
1. Convert the websocket message into our predefined datatype
2. Read our file to a string (I know I know, just for now)
3. Apply the changes using the 'operational_transform' crate
4. Write the string to our file
5. Send a message back saying complete
6. Update frontend to reflect changes (not sure about this part yet)

TODO:
- figure out how I want to store/load document. currently we can make changes to a blank one only.
Current issue:
- If we load file contents on initial page load, then we might be missing deltas from other users. two options:
  - Have listener for file load, in which:
    - If file is being loaded by another user, pause editing by other users
    - While file is being loaded, backlog deltas to apply to file when loaded.


- see ops.rs
- To do: see how to make websocket many to one. 
  - we want to have messages incoming from all users, then an "update" message that tells the react frontend to grab the newly updated file.
  - why is the file clearing when the server shuts down? tf? nevermind
  - clean up the code in general
  - STRUCTURE the project for fuck sakes its a mess
  - add a cute little saving/saved thing 
  - research a better method to this than strings
    - maybe a line buffer? idk
      - might be hard to handle with delta data type
    - also, response/err formatting needs work.

More brain dump:
- Eventually, have some sort of set up where:
  - Multiple users log into a session using a session ID
  - This session has access only to the files that are in that session's project
  - Main page is view of all projects
  - clicking in opens the directory of files
  - button to invite using a session id
  - once started, can stop session and work solo
  - now we need two sockets, a solo and collab one

- phase 0
  - any user can visit and edit this endless text document.
  - Need to implement:
    - collaborative websocket
    - converting functionalities of toolbar to markdown syntax (hard)
    - OR
    - lets add a nice markdown renderer (easier, kinda)
- phase 1
  - Users can log in and see their directory. 
  - can invite somebody by session id; no log in for now
  - This requires:
    - auth and users
    - tree view
    - editor view
    - two web sockets, solo and collab