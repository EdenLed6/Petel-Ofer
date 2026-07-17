import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-7xl mb-4" aria-hidden="true">🫐</p>
      <h1 className="text-4xl font-black text-berry-deep">אופס, הדף לא נמצא</h1>
      <p className="mt-3 text-ink/70">נראה שהגעתם לשביל שלא מוביל לחממה...</p>
      <Link
        href="/"
        className="inline-block mt-8 bg-berry hover:bg-berry-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
}
