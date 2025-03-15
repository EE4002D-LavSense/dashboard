import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex justify-center p-8">
      <Link
        href="/admin/dashboard"
        className="m-4 rounded-md bg-blue-500 p-4 text-white"
      >
        Dashboard
      </Link>
      <Link
        href="/admin/log"
        className="m-4 rounded-md bg-blue-500 p-4 text-white"
      >
        API Log
      </Link>
      <Link
        href="/admin/add-toilet"
        className="m-4 rounded-md bg-blue-500 p-4 text-white"
      >
        Add Toilet
      </Link>
    </div>
  );
}
