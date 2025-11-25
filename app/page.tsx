export default function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-start bg-zinc-50 font-sans dark:bg-black p-4">
      Hospital Recommendation System Demo
      <input
        name="services"
        placeholder="Look for specific service"
        type="text"
        className="border-2 border-zinc-300 rounded-lg p-2 w-full max-w-md"
      />
      <select name="hospital-type" id="hospital-type">
        <option value="all">All</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
      <button className="bg-blue-500 text-white rounded-lg p-2 w-full max-w-md hover:bg-blue-600 cursor-pointer">
        Search
      </button>
    </div>
  );
}
