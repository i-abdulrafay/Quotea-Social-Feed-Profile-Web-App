export default function InputField({ name, type, placeholder, onChange }) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}
