export default function AuthCard({ title, children, footer }) {
  return (
    <div className="bg-white p-10 lg:p-12 rounded-xl shadow-xl w-full max-w-lg">
      <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8 text-blue-700">
        {title}
      </h1>
      {children}
      {footer && (
        <div className="mt-6 text-center text-base text-gray-600 ">
          {footer}
        </div>
      )}
    </div>
  );
}
