import Image from 'next/image'
import { Zap } from 'lucide-react'

export function Header() {
  return (
    <header className="mb-8 relative overflow-hidden rounded-xl">
      {/* Nano Banana generated background */}
      <div className="absolute inset-0">
        <Image
          src="/header-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2980b9]/90 to-[#3fb3d4]/80" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 px-8 py-8">
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
          <Zap className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-white drop-shadow-sm">
            Revenue Growth Calculator
          </h1>
          <p className="text-lg text-white/85 mt-1">
            See the impact of improving your key business metrics
          </p>
        </div>
      </div>
    </header>
  )
}
