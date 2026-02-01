import { Metadata } from "next";
import { getCourseById } from "@/lib/api";
import SharePageClient from "./SharePageClient";

interface SharePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

/**
 * Open Graph 메타태그 생성 (공유 링크 미리보기 최적화)
 */
export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  try {
    // Next.js 15: params는 Promise
    const { courseId } = await params;

    // 서버에서 코스 정보 미리 가져오기
    const course = await getCourseById(courseId);

    // 대표 이미지 (첫 번째 장소의 첫 번째 이미지)
    const imageUrl =
      course.places[0]?.imageUrls?.[0] ||
      "https://via.placeholder.com/1200x630?text=Ddalkkak+Date";

    // 코스 요약 정보
    const placeCount = course.places.length;
    const placeNames = course.places
      .slice(0, 3)
      .map((p) => p.name)
      .join(" → ");

    const description =
      course.description ||
      `${course.regionName}에서 즐기는 ${course.dateTypeName} 데이트 코스 (${placeCount}곳)`;

    return {
      title: `✨ ${course.courseName} | 똑딱 데이트`,
      description,
      openGraph: {
        type: "website",
        title: `✨ ${course.courseName}`,
        description: `${description}\n\n${placeNames}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: course.courseName,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `✨ ${course.courseName}`,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("메타데이터 생성 실패:", error);
    return {
      title: "코스 공유 | 똑딱 데이트",
      description: "AI가 추천하는 특별한 데이트 코스",
    };
  }
}

/**
 * 코스 공유 페이지 (서버 컴포넌트)
 */
export default async function SharePage({ params }: SharePageProps) {
  // Next.js 15: params는 Promise
  const { courseId } = await params;
  return <SharePageClient courseId={courseId} />;
}
