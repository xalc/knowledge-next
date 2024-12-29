'use client';
import { usePathname } from 'next/navigation'
import { ModeToggle } from './header/theme-selector';
import Link from 'next/link'
import Header from './header/header';

export default function UILayout({ children }) {
  const pathname = usePathname()
  const landingPage = pathname === '/';


  if (landingPage) {
    return <>{children}</>
  }
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className=' flex-1 w-auto  m-8'>
        {children}
      </main>

      <footer className='flex w-full basis-12 shadow-xl border justify-center items-center'>
        <div>Hunterx</div>
      </footer>
    </div>
  )
}