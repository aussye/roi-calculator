import { Header } from '@/components/Header'
import { Calculator } from '@/components/Calculator'

export default function RevenueCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#595959] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <Calculator />
      </div>
    </main>
  )
}
