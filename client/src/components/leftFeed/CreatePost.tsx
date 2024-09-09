import React from 'react'
import { Dialog, DialogContent } from '../ui/dialog'

const CreatePost:React.FC = () => {
  const createPostHandler = async(e){
    e.preventdefault()
  }
    return (
    <div>
        <Dialog>
            <DialogContent>
                <form onSubmit={createPostHandler} />
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default CreatePost