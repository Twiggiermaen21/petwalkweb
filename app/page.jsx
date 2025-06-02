"use client";


export default function Home() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-yellow-50">
      <div className="bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full gap-6">
        <img
          src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80"
          alt="Pies"
          className="w-52 h-52 rounded-full object-cover shadow-lg border-4 border-cyan-100"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-800 tracking-wide text-center">
          PetWalk
        </h1>
        <p className="text-lg text-gray-500 text-center font-medium">
          Twój najlepszy asystent do opieki nad psem.<br />Śledź spacery, zdrowie i dobre chwile!
        </p>
      </div>
    </div>
  );
}
