'use client'
import { useRouter } from 'next/navigation';
export default function Page() {
  const router = useRouter()
  return (<div
    onDoubleClick={() => router.push('/theme')}
    className='w-screen h-screen bg-cover bg-no-repeat bg-center'
    style={{ backgroundImage: 'url("https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN")' }}
  ></div>)
}