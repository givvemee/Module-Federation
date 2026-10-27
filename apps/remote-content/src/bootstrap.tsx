import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ContentPage from './ContentPage';

// 리모트 단독 실행용 진입점. 호스트에서는 ContentPage만 가져간다.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ padding: 24 }}>
      <ContentPage />
    </div>
  </StrictMode>,
);
