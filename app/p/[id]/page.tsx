export default async function PastePage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params; // ✅ Await params Promise
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`, {
      cache: "no-store",
    });
  
    if (!res.ok) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-red-500 text-xl font-semibold">Paste not found or expired.</h1>
        </div>
      );
    }
  
    const data = await res.json();
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Paste</h1>
          <pre className="bg-gray-100 text-gray-900 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
            {data.content}
          </pre>
        </div>
      </div>
    );
  }
  