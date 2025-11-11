import { Navigate, useSearchParams } from 'react-router-dom';

/**
 * Redirect page for backward compatibility with old query param format
 * Redirects /share?share=xyz to /share/xyz
 */
export default function LegacyShareRedirectPage() {
  const [searchParams] = useSearchParams();
  const shareId = searchParams.get('share');

  if (shareId) {
    return <Navigate to={`/share/${shareId}`} replace />;
  }

  return <Navigate to="/" replace />;
}
