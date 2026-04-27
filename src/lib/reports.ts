export type ReportCategoryKey = 'nepse' | 'forex' | 'smc';

export type ReportPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  metaDescription: string;
  image: string;
  altText: string;
  status: 'published' | 'draft';
  views: number;
};

const REPORT_CATEGORY_LABELS: Record<ReportCategoryKey, string> = {
  nepse: 'NEPSE',
  forex: 'Forex',
  smc: 'Smart Money Concepts',
};

function normalizeCategory(value: string) {
  return value.trim().toLowerCase();
}

export function isReportCategory(category: string) {
  const normalized = normalizeCategory(category);
  return (
    normalized === 'nepse' ||
    normalized === 'forex' ||
    normalized === 'smart money concepts'
  );
}

function resolveServerApiBaseUrl() {
  const publicBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (publicBase && /^https?:\/\//i.test(publicBase)) {
    return publicBase.replace(/\/+$/, '');
  }

  const backendOrigin = process.env.NEXT_BACKEND_ORIGIN || 'http://127.0.0.1:8000';
  return `${backendOrigin.replace(/\/+$/, '')}/api`;
}

export async function fetchPublishedReports(categoryKey?: ReportCategoryKey): Promise<ReportPost[]> {
  try {
    const response = await fetch(`${resolveServerApiBaseUrl()}/posts`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    const items = data as ReportPost[];
    const expectedCategory = categoryKey ? normalizeCategory(REPORT_CATEGORY_LABELS[categoryKey]) : null;

    return items.filter((item) => {
      if (item.status !== 'published') {
        return false;
      }

      const itemCategory = normalizeCategory(item.category || '');
      if (!isReportCategory(itemCategory)) {
        return false;
      }

      if (!expectedCategory) {
        return true;
      }

      return itemCategory === expectedCategory;
    });
  } catch {
    return [];
  }
}
