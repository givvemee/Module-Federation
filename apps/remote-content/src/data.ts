export type ContentStatus = 'draft' | 'published' | 'archived';

export interface Content {
  id: string;
  title: string;
  author: string;
  status: ContentStatus;
  updatedAt: string;
}

export const INITIAL_CONTENTS: Content[] = [
  { id: 'c-1', title: '가을 신상품 기획전', author: 'kim', status: 'published', updatedAt: '2026-10-20' },
  { id: 'c-2', title: '회원 등급 개편 안내', author: 'lee', status: 'draft', updatedAt: '2026-10-24' },
  { id: 'c-3', title: '여름 세일 종료 공지', author: 'park', status: 'archived', updatedAt: '2026-09-01' },
];
