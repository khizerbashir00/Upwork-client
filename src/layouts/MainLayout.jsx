import { Outlet } from 'react-router-dom'
import BackgroundDecor from '../components/BackgroundDecor'

export default function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <BackgroundDecor />
      <Outlet />
    </div>
  )
}
