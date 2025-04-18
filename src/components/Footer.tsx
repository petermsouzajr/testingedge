import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-600 py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          {/* Add optional links like LinkedIn here if desired */}
          <Link
            href="/privacy-policy"
            className="text-sm hover:underline mx-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-sm hover:underline mx-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </Link>
          {/* You'll need to create these pages later */}
        </div>
        <p className="text-sm">
          &copy; {currentYear} Testing Edge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
