import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <div>
      <div>
        Sidebar
      </div>
      <div>
        Appbar
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
