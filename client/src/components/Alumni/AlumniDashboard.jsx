import React from 'react'
import Chat from '../../components/Chat/Chat'
import AdminNavbar from '../Admin/AdminNavbar'
import AlumniNavbar from './AlumniNavbar'
import Sidebar from './Sidebar'
import ConnectionsSidebar from './ConnectionsSidebar'
import Feed from './Feed'

const AlumniDashboard = () => {
  return (
    <div className=''
    // style={{ backgroundImage: "url('/obbu.jpg')" }}
        >
      {/* <AlumniNavbar/> */}
      
      <div className="flex flex-1 bg-[#045774]"
      style={{ backgroundImage: "url('/obbu.jpg')" }}
      >
        <Sidebar />
        <Feed />
        <ConnectionsSidebar />
      </div>
      {/* <Chat/> */}
    </div>
  )
}

export default AlumniDashboard
