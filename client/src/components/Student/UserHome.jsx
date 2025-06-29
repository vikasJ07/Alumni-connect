import React from 'react'
import StudentSidebar from './StudentSidebar'
import StudentConnectionsSidebar from './StudentConnectionsSidebar'
import StudentPostDisplay from './StudentPostDisplay'

const UserHome = () => {
  return (
    <div className=''
    // style={{ backgroundImage: "url('/obbu.jpg')" }}
        >
      {/* <AlumniNavbar/> */}
      
      <div className="flex flex-1 bg-[#045774]"
      style={{ backgroundImage: "url('/obbu.jpg')" }}
      >
        <StudentSidebar />
        <StudentPostDisplay />
        <StudentConnectionsSidebar />
      </div>
      {/* <Chat/> */}
    </div>
  )
}

export default UserHome
