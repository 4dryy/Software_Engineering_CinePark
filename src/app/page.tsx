
import { redirect } from 'next/navigation';

export default async function RootPage() {
  // Always redirect to the landing page.
  // Middleware will handle redirecting authenticated users from /landing to /dashboard.
  redirect('/landing');
  return null; 
}
