export default function Button({ label, type = "button" }) {
  return (
    <button
      type={type}
      className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
    >
      {label}
    </button>
  );
}
