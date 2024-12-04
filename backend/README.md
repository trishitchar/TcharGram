
```
backend
    src
        controller
            user.controller.ts (register, login, logout, getProfile, editProfile, followOrUnfollow, getSuggestedUsers)
            post.controller.ts (addNewPost,deletePost,getAllPost,currentUserPost,likePost,dislikePost,addComment,getCommentsOfPost,deleteComment,bookmarkPost)
            message.controller.ts (sendMessage,getMessage)
        middlewares
            isTokenValid.ts (verify the token and send the id to next route)
            multer.ts (for upload and limits)
        model
            user.model.ts
            post.model.ts
            comment.model.ts
            message.model.ts
            conversation.model.ts
        routes
            user.routes.ts
            post.routes.ts
            message.routes.ts
        socketio
            socketio.ts
        utils
            db.ts (connect to db)
            datauri.ts (data -> uri)
            cloudinary.ts (upload to cloud)
        
        custom.declaration.ts (sometimes ts gives problem so temp solution)

        index.ts (main file)
```

1. if you cannot find types of any particular package use ``` npm i --save-dev @types/<package name> ``` or you can add the format given in ```src/custom.declaration.ts```

# docker
- add the env according to your env
- ```docker build -t tchargram-backend .```
- ```docker images```
- ```docker run -p 8080:8080 my-backend-app```