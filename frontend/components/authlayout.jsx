export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex flex-col justify-center items-center md:items-start w-full md:w-1/2 px-8 lg:px-20">
        <h1 className="text-6xl lg:text-7xl font-extrabold text-blue-700 tracking-tight">
          Quotea
        </h1>
        <p className="mt-6 text-2xl lg:text-3xl text-gray-600 max-w-lg leading-snug text-center md:text-left">
          Share and discover inspiring quotes <br /> that brighten your day.
        </p>
      </div>

      <div className="flex justify-center items-center w-full md:w-1/2 px-6 lg:px-20">
        {children}
      </div>
    </div>
  );
}
