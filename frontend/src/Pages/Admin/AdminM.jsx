import { Outlet } from 'react-router-dom'
import Header from '../../Components/Admin/Header'

const AdminM = () => {
  return (
    <div>
        <Header />
        <Outlet />
    </div>
  )
}

export default AdminM