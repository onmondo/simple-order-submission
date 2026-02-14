1. Git checkout develop for the updated feature of the app
```
git checkout develop
```

2. Create .env file and place your port to run the server.

```
PORT=3000
ORDER_THRESHOLD=10
```

3. Run DB server using json server as the in memory database

```
npm run server
```

4. Run the backend by issuing the command

```
npm run dev
```

5. To run the test script at the backend, open a separate terminal and issue the command
```
npm run test
```

6. For running the web app, clone the web app repo, install dependencies and run the web app

```
npm i
npm run dev
```

