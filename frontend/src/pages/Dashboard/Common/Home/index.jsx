import React from 'react'
import AdminHome from './AdminHome'
import UserHome from './UserHome'

function DashboardHome() {
    const role = "user"
    if (role === "admin") {
        return <AdminHome />
    } else {
        return <UserHome />
    }
    return (
        <div>index</div>
    )
}

export default DashboardHome