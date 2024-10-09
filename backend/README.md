
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


1. correct some type of user, comment and rename and better reusability
2. correct some api like why I have to send my userid if I'm logged in already, so keep like in edit profile or get profile feature
3. one problem in incognito mode, IG in this mode browser don't save cookie so I'm also unable to get the user data as I'm decoding the jwt token from fontend cookie, so IG I'll persist the token and userdata in redux store
4. IRL time feedback of like and comment (add enter feature)
5. dummy profile pic from server
6. signin option google github (then I've to feagure it out how can I check authenticaton from backend jwttoken and fronend decodetoken also) (create one PR)