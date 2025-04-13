export function PatientPortalFooter() {
  return (
    <footer className="bg-white py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} MediCare Patient Management System. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
