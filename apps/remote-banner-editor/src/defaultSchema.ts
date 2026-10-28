import type { BannerSchema } from '@mfe/schema';

export const DEFAULT_SCHEMA: BannerSchema = {
  version: 1,
  name: '메인 상단 배너',
  fields: [
    { key: 'title', type: 'text', label: '제목', required: true, maxLength: 30, role: 'title', defaultValue: '가을 신상품 기획전' },
    { key: 'subtitle', type: 'textarea', label: '부제', maxLength: 80, role: 'subtitle', defaultValue: '10월 한 달간 최대 30% 할인' },
    { key: 'bg', type: 'color', label: '배경색', required: true, role: 'backgroundColor', defaultValue: '#1e3a8a' },
    { key: 'fg', type: 'color', label: '글자색', required: true, role: 'textColor', defaultValue: '#ffffff' },
    {
      key: 'align',
      type: 'select',
      label: '정렬',
      role: 'align',
      defaultValue: 'left',
      options: [
        { label: '왼쪽', value: 'left' },
        { label: '가운데', value: 'center' },
      ],
    },
    { key: 'showCta', type: 'boolean', label: '버튼 표시', role: 'showCta', defaultValue: true },
    { key: 'ctaLabel', type: 'text', label: '버튼 문구', maxLength: 12, role: 'ctaLabel', defaultValue: '보러 가기' },
    { key: 'ctaUrl', type: 'url', label: '버튼 링크', role: 'ctaUrl', defaultValue: 'https://example.com/fall' },
  ],
};
