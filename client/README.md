```
client
    src
      main.tsx (main starting file)
      app.tsx
      pages (no of different pages like login register feed etc)
      components
        common (for common component like header or footer)     
        leftFeed (for the left section of the project like home search profile logout button)
        middleFeed (for mainly stories and posts)
        rightFeed (for suggested user etc)
        ui (shadcn component)  
      data (hadcoded data) [replace with your backend url]
      middleware (for auth check or decode token check)
      redux (for stores and slices)         
      lib (shadcn component)
    public (static file like image etc)
```

# note - if running locally both frontend and backend then first go to data.ts and change the value according to you
- ```docker ps -a```
- ```docker build -t tchargram-frontend .```
- ```docker run -p 5173:5173 tchargram-frontend```