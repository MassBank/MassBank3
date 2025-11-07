import { useMemo } from 'react';

function ErrorElement({ message }: { message: string }) {
  return useMemo(
    () => (
      <div
        key={'error-content-view'}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p style={{ fontWeight: 'bolder', fontSize: 'larger' }}>{message}</p>
      </div>
    ),
    [message],
  );
}

export default ErrorElement;
