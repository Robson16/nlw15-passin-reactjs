import { AttendeeList } from './pages/attendee-list'
import { Header } from './components/header'

export function App() {
  return (
    <div className="flex flex-col gap-5 max-w-[1216px] mx-auto p-5">
      <Header />
      <AttendeeList />
    </div>
  )
}
