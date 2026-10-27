import { Button, Input, Table, type TableColumn } from '@mfe/design-system';
import { useMemo, useState } from 'react';
import { INITIAL_CONTENTS, type Content, type ContentStatus } from './data';

const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: '초안',
  published: '게시',
  archived: '보관',
};

export default function ContentPage() {
  const [contents, setContents] = useState(INITIAL_CONTENTS);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => contents.filter((c) => c.title.includes(query) || c.author.includes(query)),
    [contents, query],
  );

  const setStatus = (id: string, status: ContentStatus) =>
    setContents((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  const columns: TableColumn<Content>[] = [
    { key: 'title', header: '제목', render: (c) => c.title },
    { key: 'author', header: '작성자', render: (c) => c.author },
    { key: 'status', header: '상태', render: (c) => STATUS_LABEL[c.status] },
    { key: 'updatedAt', header: '수정일', render: (c) => c.updatedAt },
    {
      key: 'actions',
      header: '',
      render: (c) =>
        c.status === 'published' ? (
          <Button variant="secondary" onClick={() => setStatus(c.id, 'archived')}>보관</Button>
        ) : (
          <Button onClick={() => setStatus(c.id, 'published')}>게시</Button>
        ),
    },
  ];

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0 }}>콘텐츠 관리</h2>
      <Input placeholder="제목 또는 작성자로 검색" value={query} onChange={(e) => setQuery(e.target.value)} />
      <Table columns={columns} rows={filtered} rowKey={(c) => c.id} />
    </section>
  );
}
