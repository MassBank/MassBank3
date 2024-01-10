import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Redirect({ to }: { to: string }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    navigate({ pathname: to, search: `?${searchParams}` });
  }, [navigate, searchParams, to]);

  return null;
}

export default Redirect;
