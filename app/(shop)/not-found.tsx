import Link from "next/link";

export default function NotFound() {
  return (
    <div className="plp" style={{ minHeight: "60vh" }}>
      <h1 className="display" style={{ fontSize: 56 }}>Page not found.</h1>
      <p style={{ margin: "20px 0 28px", fontSize: 18 }}>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="pill pill-black">Back to Home</Link>
    </div>
  );
}
