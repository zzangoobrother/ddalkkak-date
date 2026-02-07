import FeedbackPageClient from "./FeedbackPageClient";

interface FeedbackPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

/**
 * 피드백 페이지 (서버 컴포넌트)
 */
export default async function FeedbackPage({ params }: FeedbackPageProps) {
  // Next.js 15: params는 Promise
  const { courseId } = await params;
  return <FeedbackPageClient courseId={courseId} />;
}
