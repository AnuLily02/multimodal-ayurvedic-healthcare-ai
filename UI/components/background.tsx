"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FBE8CE]/50 via-[#E4DFB5]/30 to-[#C3CC9B]/20" />
      
      {/* Floating leaves */}
      <svg
        className="absolute top-[10%] left-[5%] w-16 h-16 text-[#9AB17A]/30 animate-float-slow"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
      </svg>
      
      <svg
        className="absolute top-[20%] right-[10%] w-12 h-12 text-[#C3CC9B]/40 animate-float-medium"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDelay: '1s' }}
      >
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
      </svg>
      
      <svg
        className="absolute top-[60%] left-[8%] w-10 h-10 text-[#9AB17A]/25 animate-float-fast"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDelay: '2s' }}
      >
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
      </svg>
      
      <svg
        className="absolute top-[40%] right-[5%] w-14 h-14 text-[#E4DFB5]/35 animate-float-slow"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDelay: '3s' }}
      >
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
      </svg>
      
      <svg
        className="absolute bottom-[20%] left-[15%] w-8 h-8 text-[#C3CC9B]/30 animate-float-medium"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDelay: '4s' }}
      >
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
      </svg>
      
      <svg
        className="absolute bottom-[30%] right-[20%] w-12 h-12 text-[#9AB17A]/20 animate-float-fast"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDelay: '5s' }}
      >
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
      </svg>

      {/* Decorative circles */}
      <div className="absolute top-[15%] right-[25%] w-32 h-32 rounded-full bg-[#9AB17A]/10 animate-drift" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-[25%] left-[20%] w-24 h-24 rounded-full bg-[#C3CC9B]/10 animate-drift" style={{ animationDelay: '5s' }} />
      <div className="absolute top-[50%] right-[8%] w-20 h-20 rounded-full bg-[#E4DFB5]/15 animate-drift" style={{ animationDelay: '10s' }} />
    </div>
  )
}
