import { useState } from 'react'
import { DragDropContextType, DragDropUser } from '..'

type DragDropLock = {
  id: string
  user: DragDropUser
}

type ReturnProps = {
  dragDropContextValue: DragDropContextType
}

const useDragDropContext = (): ReturnProps => {
  const [locks, setLocks] = useState<DragDropLock[]>([])

  const lock = (user: DragDropUser) => {
    const id = Math.random().toString(36).substring(7)
    const newLock = { id, user }
    setLocks([...locks, newLock])

    return () => {
      setLocks(locks.filter((lock) => lock.id !== id))
    }
  }

  const currentUser =
    locks[locks.length - 1] === undefined
      ? 'AddAssetDialog'
      : locks[locks.length - 1].user

  const dragDropContextValue: DragDropContextType = {
    current: currentUser,
    lock,
  }

  return {
    dragDropContextValue,
  }
}

export default useDragDropContext
