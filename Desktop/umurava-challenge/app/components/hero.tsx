import Image from "next/image"
import { Button } from "@/components/ui/button"

interface AvatarProps {
  src: string
  alt: string
}

const Avatar = ({ src, alt }: AvatarProps) => (
  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
    <Image src={src || "/placeholder.svg"} alt={alt} width={32} height={32} className="object-cover" />
  </div>
)

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-10 pb-16 md:pt-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D6CDF] leading-tight">
              Build Work Experience through Skills Challenges Program
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
              Enhance your Employability and Accelerate your Career Growth by working on Hands-on projects & hackathons
              from various businesses & organizations.
            </p>
            <Button className="bg-[#2D6CDF] hover:bg-[#2D6CDF]/90 text-white px-8 py-6 text-lg rounded-md">
              Get Started
            </Button>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hero%20section%20(2)-vryuIQwYNN9j93nxzKwXAX8xOZrGhE.png"
                alt="People working on laptops"
                width={600}
                height={400}
                className="rounded-lg"
                priority
              />

              <div className="absolute bottom-4 left-4 flex items-center bg-white/80 backdrop-blur-sm rounded-full py-2 px-4 gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} src={`/placeholder.svg?height=32&width=32`} alt={`User ${i}`} />
                  ))}
                </div>
                <div className="pl-2">
                  <p className="text-sm font-semibold">20K+</p>
                  <p className="text-xs text-gray-600">Talents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

