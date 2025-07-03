import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Star, Heart, Play, Clock, Users, BookOpen, ChevronDown, ChevronUp, MessageSquare, Share } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import YouTubePlayer from "@/components/YouTubePlayer";
import { supabase } from "@/lib/supabase";

const LectureDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // DB 데이터 상태
  const [lecture, setLecture] = useState<any>(null);
  const [instructor, setInstructor] = useState<any>(null);
  const [reviewStats, setReviewStats] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  // Refs for scrolling to sections
  const overviewRef = useRef<HTMLDivElement>(null);
  const qaRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const creatorRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const [qnaList, setQnaList] = useState<any[]>([]);
  const [qnaLoading, setQnaLoading] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [curriculumLoading, setCurriculumLoading] = useState(false);

  const [selectedVideoDetail, setSelectedVideoDetail] = useState<any | null>(null);
  const [canPlayVideo, setCanPlayVideo] = useState(false);

  // 후기 관련 상태 추가
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewLikes, setReviewLikes] = useState<Record<string, boolean>>({});

  // 베스트 후기 상태 추가
  const [bestReviews, setBestReviews] = useState<any[]>([]);

  // 베스트 후기 모달 상태
  const [openBestReviewModal, setOpenBestReviewModal] = useState(false);
  const [selectedBestReview, setSelectedBestReview] = useState<any | null>(null);

  // 초를 시:분:초로 변환
  const formatDuration = (seconds?: number) => {
    if (!seconds || isNaN(seconds)) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h > 0 ? String(h).padStart(2, '0') : null,
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // 1. 강의 정보
      const { data: lectureData } = await supabase.from("lectures").select("*", { count: "exact" }).eq("id", id).single();
      setLecture(lectureData);
      // 2. 강사 정보
      if (lectureData?.instructors_user_id) {
        const { data: instructorData } = await supabase
          .from("instructors")
          .select("*")
          .eq("user_id", lectureData.instructors_user_id)
          .single();
        setInstructor(instructorData);
      }
      // 3. 별점/리뷰수
      const { data: reviews } = await supabase
        .from("lecture_reviews")
        .select("rating")
        .eq("lecture_id", id);
      if (reviews && reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setReviewStats({ avg: Math.round(avg * 10) / 10, count: reviews.length });
      } else {
        setReviewStats({ avg: 0, count: 0 });
      }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  // 좋아요 수, 내 좋아요 상태 fetch
  useEffect(() => {
    const fetchLikes = async () => {
      if (!id) return;
      // 전체 좋아요 수
      const { count } = await supabase
        .from("lecture_likes")
        .select("*", { count: "exact", head: true })
        .eq("lecture_id", id);
      setLikeCount(count || 0);
      // 내 좋아요 여부
      const { data: userData } = await supabase.auth.getUser();
      const myId = userData?.user?.id || null;
      setUserId(myId);
      if (myId) {
        const { count: myLikeCount } = await supabase
          .from("lecture_likes")
          .select("*", { count: "exact", head: true })
          .eq("lecture_id", id)
          .eq("member_user_id", myId);
        setIsLiked((myLikeCount || 0) > 0);
      } else {
        setIsLiked(false);
      }
    };
    fetchLikes();
  }, [id]);

  // 스크롤 위치 추적을 위한 useEffect
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { ref: overviewRef, id: 'overview' },
        { ref: qaRef, id: 'qa' },
        { ref: curriculumRef, id: 'curriculum' },
        { ref: creatorRef, id: 'creator' },
        { ref: reviewsRef, id: 'reviews' }
      ];

      const scrollPosition = window.scrollY + 200; // 200px 오프셋

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveTab(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 질문/답변 데이터 fetch
  useEffect(() => {
    const fetchQna = async () => {
      if (!id) return;
      setQnaLoading(true);
      // 모든 QnA 데이터(질문+답변) 가져오기
      const { data, error } = await supabase
        .from("lecture_qna")
        .select("*")
        .eq("lecture_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        setQnaList([]);
        setQnaLoading(false);
        return;
      }
      // 질문(부모글)과 답변(자식글) 분리
      const questions = data.filter((item: any) => !item.parent_id);
      const answers = data.filter((item: any) => item.parent_id);
      // 회원 id 목록, 강사 user_id 목록 추출
      const memberIds = [...new Set(questions.map((q: any) => q.member_user_id))];
      const instructorUserIds = [...new Set(answers.map((a: any) => a.member_user_id))];
      // 회원 이름 매핑
      let memberMap: Record<string, string> = {};
      if (memberIds.length > 0) {
        const { data: members } = await supabase
          .from("member")
          .select("id, name")
          .in("id", memberIds);
        if (members) {
          members.forEach((m: any) => { memberMap[m.id] = m.name; });
        }
      }
      // 강사 이름 매핑
      let instructorMap: Record<string, string> = {};
      if (instructorUserIds.length > 0) {
        const { data: instructors } = await supabase
          .from("instructors")
          .select("user_id, name")
          .in("user_id", instructorUserIds);
        if (instructors) {
          instructors.forEach((i: any) => { instructorMap[i.user_id] = i.name; });
        }
      }
      // 답변을 질문 아래에 붙이기 + 이름 병합
      const qnaWithAnswers = questions.map((q: any) => ({
        ...q,
        displayName: memberMap[q.member_user_id] || q.member_user_id,
        answers: answers
          .filter((a: any) => a.parent_id === q.id)
          .map((a: any) => ({
            ...a,
            displayName: instructorMap[a.member_user_id] || a.member_user_id
          }))
      }));
      setQnaList(qnaWithAnswers);
      setQnaLoading(false);
    };
    fetchQna();
  }, [id, questionText]);

  // 커리큘럼(세션+영상) 데이터 fetch
  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!id) return;
      setCurriculumLoading(true);
      // 세션 목록
      const { data: sessionData } = await supabase
        .from("lecture_sessions")
        .select("*")
        .eq("lecture_id", id)
        .order("session_order", { ascending: true });
      setSessions(sessionData || []);
      // 영상 목록
      const { data: videoData } = await supabase
        .from("lecture_videos")
        .select("*")
        .eq("lecture_id", id)
        .order("video_title", { ascending: true });
      setVideos(videoData || []);
      setCurriculumLoading(false);
    };
    fetchCurriculum();
  }, [id]);

  // 영상 상세 모달 접근권한 체크
  useEffect(() => {
    const checkVideoAccess = async () => {
      if (!selectedVideoDetail || !userId) {
        setCanPlayVideo(false);
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('lecture_applications')
        .select('id')
        .eq('lecture_id', id)
        .eq('member_user_id', userId)
        .eq('status', '입금완료')
        .lte('start_date', today)
        .gte('end_date', today)
        .maybeSingle();
      setCanPlayVideo(!!data && !error);
    };
    checkVideoAccess();
  }, [selectedVideoDetail, userId, id]);

  // 후기 데이터 fetch
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      
      // 후기 데이터 가져오기
      const { data, error } = await supabase
        .from("lecture_reviews")
        .select("*")
        .eq("lecture_id", id)
        .order("created_at", { ascending: false });
      
      if (error) {
        setReviews([]);
        setReviewsLoading(false);
        return;
      }

      // 회원 이름 매핑
      const memberIds = [...new Set(data.map((r: any) => r.member_user_id))];
      let memberMap: Record<string, string> = {};
      
      if (memberIds.length > 0) {
        const { data: members } = await supabase
          .from("member")
          .select("id, name")
          .in("id", memberIds);
        if (members) {
          members.forEach((m: any) => { memberMap[m.id] = m.name; });
        }
      }

      // 사용자의 좋아요 상태 가져오기
      let userLikesMap: Record<string, boolean> = {};
      if (userId) {
        const { data: userLikes } = await supabase
          .from("lecture_review_likes")
          .select("review_id")
          .eq("member_user_id", userId)
          .in("review_id", data.map((r: any) => r.id));
        
        if (userLikes) {
          userLikes.forEach((like: any) => {
            userLikesMap[like.review_id] = true;
          });
        }
      }

      // 후기 데이터에 이름 추가
      const reviewsWithNames = data.map((review: any) => ({
        ...review,
        displayName: memberMap[review.member_user_id] || review.member_user_id,
        date: new Date(review.created_at).toLocaleDateString('ko-KR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\./g, '').replace(/\s/g, '.')
      }));

      setReviews(reviewsWithNames);
      setReviewLikes(userLikesMap);
      setReviewsLoading(false);
    };

    fetchReviews();
  }, [id, userId]);

  // 베스트 후기 데이터 fetch
  useEffect(() => {
    const fetchBestReviews = async () => {
      if (!id) return;
      // likes가 높은 순으로 4개
      const { data, error } = await supabase
        .from("lecture_reviews")
        .select("*")
        .eq("lecture_id", id)
        .order("likes", { ascending: false })
        .limit(4);
      if (error || !data) {
        setBestReviews([]);
        return;
      }
      // 회원 이름 매핑
      const memberIds = [...new Set(data.map((r: any) => r.member_user_id))];
      let memberMap: Record<string, string> = {};
      if (memberIds.length > 0) {
        const { data: members } = await supabase
          .from("member")
          .select("id, name")
          .in("id", memberIds);
        if (members) {
          members.forEach((m: any) => { memberMap[m.id] = m.name; });
        }
      }
      // 이름, 날짜 추가
      const reviewsWithNames = data.map((review: any) => ({
        ...review,
        displayName: memberMap[review.member_user_id] || review.member_user_id,
        date: new Date(review.created_at).toLocaleDateString('ko-KR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\./g, '').replace(/\s/g, '.')
      }));
      setBestReviews(reviewsWithNames);
    };
    fetchBestReviews();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!lecture) return <div className="min-h-screen flex items-center justify-center">강의 정보를 찾을 수 없습니다.</div>;

  // 기존 더미 데이터 변수들 -> DB 데이터로 대체
  const lectureData = {
    id: lecture.id,
    title: lecture.title,
    instructor: instructor?.name || "-",
    level: `LV.0 ${lecture.category}`,
    rating: reviewStats.avg,
    reviews: reviewStats.count,
    originalPrice: lecture.price,
    currentPrice: lecture.discount_price || lecture.price,
    discountRate: lecture.discount_price ? Math.round(((lecture.price - lecture.discount_price) / lecture.price) * 100) : 0,
    thumbnail: lecture.thumbnail_url,
    description: lecture.description,
    badges: ["ORIGINAL", "BEST", "NEW"], // 필요시 DB에서 관리
    duration: lecture.duration ? `${lecture.duration}분` : "기간 미정",
    lessons: "총 4개 수업", // 필요시 DB에서 관리
    videoTitle: lecture.title,
    videoSubtitle: lecture.instructor_intro || "",
    videoDescription: lecture.description || "",
    topics: [lecture.category],
    finalMessage: "지금 바로 시작하세요!"
  };

  const qnaData = [
    {
      id: 1,
      question: {
        author: "박서연",
        date: "25.06.11",
        content: "24세 아들을 둔 50대후반 모친입니다. 아이가 좀처럼 두아(25년 정도 예상 목표액 3천정도)로 부동산을 투자해보려고 합니다. 엄마가 공부해서 임대주택 구매하려고 하는데, 대출관련도 급급하고, 잠깐만 아들을 프리랜서 직업입니다. 체계적으로 어느 강의를 들어봐도 도움이 될까요? 진짜 부동산완전과 관련은 아주 피상적으로 아는 정도입니다...",
        likes: 0
      },
      answer: {
        author: "나나위",
        date: "25.06.12",
        content: "안녕하세요! 부동산 투자 초보자시라면 이 강의가 정말 도움이 될 것 같아요. 특히 첫 번째 수업에서 '내 노후준비에 필요한 자금 계산법'을 다루고 있어서, 목표 자금 3천만원에 맞는 구체적인 투자 계획을 세우실 수 있을 거예요. 프리랜서 자녀분의 소득 불안정성도 고려한 안전한 투자 방법을 알려드릴게요!"
      }
    },
    {
      id: 2,
      question: {
        author: "차명희",
        date: "25.06.04",
        content: "월부에서 재테크 공부를 체계적으로 나나위님과 하고 있어서 오랜전부터 채널을 구독해 오던 중 최근에 오프라인 강의가 늘어서 신청용 하려고 여겼는데. 현재 75세 여성, 예금 종자는 3억, 아파트+빌라 약 7억, 주식 2억 보유하고 따라갈 수 있을까요? 도움을 받고 싶습니다.",
        likes: 1
      },
      answer: {
        author: "나나위",
        date: "25.06.05",
        content: "와! 이미 상당한 자산을 보유하고 계시네요 😊 이 강의는 초보자뿐만 아니라 기존 투자자분들께도 매우 유용합니다. 특히 세 번째 수업에서 다루는 '실제 사례로 배우는 부동산으로 부자되는 공식'에서는 현재 시장 상황에 맞는 고급 전략들을 다루고 있어요. 보유하신 자산을 더 효율적으로 운용하는 방법을 배우실 수 있을 거예요!"
      }
    }
  ];

  const curriculum = [
    {
      title: "평범한 직장인에게 투자가 '벌수'인 이유",
      subtitle: "내 노후준비에 필요한 자금 계산법",
      items: [
        "월급받고 저축만 하는는 방법",
        "실거래 전락 vs 자산 획득 전략의 차이점", 
        "투자로 10억 이상 벌기 위한 3가지"
      ],
      duration: "01:06:49"
    },
    {
      title: "초보자가 투자로 돈을 벌기 위해 가장 먼저 해야 할 것",
      subtitle: "수도권 투자 vs 지방 투자 선택하는 기준",
      items: [
        "모을 수 있는 돈이 적은 경우, 졸자는 머먼 하는 법",
        "부동산이 자동으로 절하는는 구조 만드는 법",
        "나나위가 스앰으로 자산을 늘린 과정 따라하기"
      ],
      duration: "00:46:01"
    },
    {
      title: "[최신 시장 반영] 실제 사례로 배우는 부동산으로 부자되는 공식",
      subtitle: "지금 시점에서 기회를 잡는 법",
      items: [
        "실제 사례로 말하는 부동산 투자의 핵심",
        "현재 부동산 시장에 대한 전략",
        "현재 서울 vs 지방 부동산 가격",
        "가치대비 저평가 아파트 찾아내는 방법",
        "[독점공개] 충청도별 공략 가능성 지역들"
      ],
      duration: "01:09:04"
    },
    {
      title: "부동산으로 10억 만드는 가장 현실적인 투자 계획",
      subtitle: "사례로 말하는 임대 활하는 방법",
      items: [
        "임대에서 중요한 조건 3+1",
        "토지는 아파트 구조",
        "수도권 부동산 투자로 자산가가 되는 방법",
        "지방 부동산 투자로 좋자는을 늘리는 방법",
        "지금 해야 할 부동산 투자 액션플랜"
      ],
      duration: "01:27:28"
    }
  ];

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, tabName: string) => {
    setActiveTab(tabName);
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuestionSubmit = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!questionText.trim()) return;
    if (questionText.length > 500) {
      alert("최대 500글자까지 입력 가능합니다.");
      return;
    }
    // DB 저장
    const { error } = await supabase.from("lecture_qna").insert({
      lecture_id: id,
      member_user_id: userId,
      content: questionText.trim(),
      parent_id: null
    });
    if (error) {
      alert("질문 등록에 실패했습니다. 다시 시도해 주세요.");
      return;
    }
    setQuestionText("");
    alert("질문이 등록되었습니다.");
    // 필요시 질문 목록 새로고침 로직 추가
  };

  const handleSampleClick = () => {
    setSelectedVideo({
      url: lecture?.sample_video_url || '',
      title: lectureData.title
    });
  };

  // 줄바꿈 변환 유틸 (HTML로 변환)
  const nl2brHtml = (text?: string | null) =>
    text ? text.replace(/\\n/g, '<br/>') : '';

  // 좋아요 토글 핸들러
  const handleLikeClick = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (isLiked) {
      // 좋아요 취소
      await supabase
        .from("lecture_likes")
        .delete()
        .eq("lecture_id", id)
        .eq("member_user_id", userId);
      setIsLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      // 좋아요 추가
      await supabase
        .from("lecture_likes")
        .insert({ lecture_id: id, member_user_id: userId });
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  // QnA 좋아요 토글 핸들러
  const handleQnaLike = async (qnaId: string) => {
    // localStorage로 임시 중복 방지(로그인 연동 시 확장 가능)
    const likedKey = `qna_like_${qnaId}`;
    const alreadyLiked = localStorage.getItem(likedKey) === '1';
    if (alreadyLiked) {
      // 좋아요 취소
      await supabase.rpc('decrement_qna_likes', { qna_id: qnaId });
      localStorage.removeItem(likedKey);
    } else {
      // 좋아요 증가
      await supabase.rpc('increment_qna_likes', { qna_id: qnaId });
      localStorage.setItem(likedKey, '1');
    }
    // 새로고침
    setQnaList((prev) => prev.map(q => q.id === qnaId ? { ...q, likes: alreadyLiked ? (q.likes || 1) - 1 : (q.likes || 0) + 1 } : q));
  };

  // 후기 등록 핸들러
  const handleReviewSubmit = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!reviewText.trim()) {
      alert("후기를 입력해주세요.");
      return;
    }
    if (reviewText.length > 500) {
      alert("최대 500글자까지 입력 가능합니다.");
      return;
    }
    
    // DB 저장
    const { error } = await supabase.from("lecture_reviews").insert({
      lecture_id: id,
      member_user_id: userId,
      rating: reviewRating,
      review: reviewText.trim()
    });
    
    if (error) {
      alert("후기 등록에 실패했습니다. 다시 시도해 주세요.");
      return;
    }
    
    setReviewText("");
    setReviewRating(5);
    alert("후기가 등록되었습니다.");
    
    // 후기 목록 새로고침
    const { data, error: fetchError } = await supabase
      .from("lecture_reviews")
      .select("*")
      .eq("lecture_id", id)
      .order("created_at", { ascending: false });
    
    if (!fetchError && data) {
      // 회원 이름 매핑
      const memberIds = [...new Set(data.map((r: any) => r.member_user_id))];
      let memberMap: Record<string, string> = {};
      
      if (memberIds.length > 0) {
        const { data: members } = await supabase
          .from("member")
          .select("id, name")
          .in("id", memberIds);
        if (members) {
          members.forEach((m: any) => { memberMap[m.id] = m.name; });
        }
      }

      // 후기 데이터에 이름 추가
      const reviewsWithNames = data.map((review: any) => ({
        ...review,
        displayName: memberMap[review.member_user_id] || review.member_user_id,
        date: new Date(review.created_at).toLocaleDateString('ko-KR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\./g, '').replace(/\s/g, '.')
      }));

      setReviews(reviewsWithNames);
    }
  };

  // 후기 좋아요 토글 핸들러
  const handleReviewLike = async (reviewId: string) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const alreadyLiked = reviewLikes[reviewId];
    
    if (alreadyLiked) {
      // 좋아요 취소
      const { error } = await supabase
        .from("lecture_review_likes")
        .delete()
        .eq("review_id", reviewId)
        .eq("member_user_id", userId);
      
      if (error) {
        alert("좋아요 취소에 실패했습니다.");
        return;
      }
      
      // lecture_reviews 테이블의 likes 감소
      await supabase.rpc('decrement_review_likes', { review_id: reviewId });
      
      // 상태 업데이트
      setReviewLikes(prev => ({ ...prev, [reviewId]: false }));
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, likes: Math.max(0, (r.likes || 1) - 1) } : r));
    } else {
      // 좋아요 추가
      const { error } = await supabase
        .from("lecture_review_likes")
        .insert({
          review_id: reviewId,
          member_user_id: userId
        });
      
      if (error) {
        alert("좋아요 등록에 실패했습니다.");
        return;
      }
      
      // lecture_reviews 테이블의 likes 증가
      await supabase.rpc('increment_review_likes', { review_id: reviewId });
      
      // 상태 업데이트
      setReviewLikes(prev => ({ ...prev, [reviewId]: true }));
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r));
    }
  };

  // 베스트 수강 후기에서 더보기 클릭 시
  const handleBestReviewMore = (review: any) => {
    setSelectedBestReview(review);
    setOpenBestReviewModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 영역 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 강의 메인 정보 - 깔끔한 배너 스타일 */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* 배너 섹션 */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded inline-block text-sm font-semibold">
                      {lectureData.level}
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                      {lectureData.title}
                    </h1>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{lectureData.rating}</span>
                        <span className="text-gray-500">({lectureData.reviews.toLocaleString()})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl">👨‍💼</span>
                        </div>
                        <p className="font-semibold text-gray-800">{instructor?.name || '-'}</p>
                        <p className="text-sm text-gray-600">{instructor?.main_field || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 가격 및 구매 정보 */}
              <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500 text-white">NEW</Badge>
                    <Badge className="bg-blue-500 text-white">BEST</Badge>
                    <Badge className="bg-black text-white">ORIGINAL</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={handleSampleClick}
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Play className="w-4 h-4" />
                      샘플보기
                    </Button>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 line-through">
                        {lectureData.discountRate}% {lectureData.originalPrice.toLocaleString()}원
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {lectureData.currentPrice.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 베스트 수강 후기 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-6">베스트 수강 후기</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bestReviews.length === 0 ? (
                  <div className="text-gray-400 col-span-2">등록된 베스트 후기가 없습니다.</div>
                ) : (
                  bestReviews.map((review) => {
                    const isLong = review.review && review.review.length > 80;
                    return (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {review.displayName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.displayName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                              <span className="text-sm text-gray-500 ml-2">{review.rating}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                          {isLong ? (
                            <>
                              {review.review.slice(0, 80)}...{' '}
                              <button className="text-blue-600 text-sm hover:underline" onClick={() => handleBestReviewMore(review)}>
                                더보기
                              </button>
                            </>
                          ) : review.review}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => handleReviewLike(review.id)}>
                            <Heart className={`w-4 h-4 ${reviewLikes[review.id] ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </button>
                          <span className="text-sm text-gray-500">{review.likes || 0}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 베스트 후기 전체 내용 모달 */}
            {openBestReviewModal && selectedBestReview && (
              <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative mt-8">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setOpenBestReviewModal(false)}>
                    ×
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {selectedBestReview.displayName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedBestReview.displayName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= selectedBestReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">{selectedBestReview.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">{selectedBestReview.review}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleReviewLike(selectedBestReview.id)}>
                      <Heart className={`w-4 h-4 ${reviewLikes[selectedBestReview.id] ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                    <span className="text-sm text-gray-500">{selectedBestReview.likes || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 탭 네비게이션 - sticky로 고정 */}
            <div className="sticky top-16 bg-white rounded-lg border shadow-sm z-10">
              <div className="grid grid-cols-5 border-b">
                <button 
                  onClick={() => scrollToSection(overviewRef, 'overview')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'overview' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  소개
                </button>
                <button 
                  onClick={() => scrollToSection(qaRef, 'qa')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'qa' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  질문·답변 {qnaList.length}
                </button>
                <button 
                  onClick={() => scrollToSection(curriculumRef, 'curriculum')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'curriculum' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  커리큘럼
                </button>
                <button 
                  onClick={() => scrollToSection(creatorRef, 'creator')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'creator' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  크리에이터
                </button>
                <button 
                  onClick={() => scrollToSection(reviewsRef, 'reviews')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'reviews' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  후기 {reviews.length}
                </button>
              </div>
            </div>

            {/* 소개 섹션 */}
            <div ref={overviewRef} className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">소개</h3>
              
              {/* 강의 설명 비디오 섹션 */}
              <div className="bg-blue-600 rounded-lg p-8 text-white text-center mb-6">
                <h2 className="text-3xl font-bold mb-4">{lectureData.videoTitle}</h2>
                <p className="text-lg mb-6">{lectureData.videoSubtitle}</p>
                <p className="text-xl mb-8">{lectureData.videoDescription}</p>
                
                <div className="flex justify-center items-center gap-8 mb-8">
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
                    {lectureData.topics[0]}
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl font-bold">+</span>
                  </div>
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
                    {lectureData.topics[1]}
                  </div>
                </div>
                
                <p className="text-lg font-medium">
                  <span className="text-yellow-300">{lectureData.finalMessage}</span>
                </p>
              </div>


            </div>

            {/* 질문·답변 섹션 */}
            <div ref={qaRef} className="bg-white rounded-lg border p-6">
              <div className="mb-4">
                <Textarea
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  placeholder="질문을 입력하세요 (최대 500자)"
                  maxLength={500}
                  className="mb-2"
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{questionText.length}/500</span>
                  <Button onClick={handleQuestionSubmit} disabled={!questionText.trim() || questionText.length > 500}>
                    질문 등록
                  </Button>
                </div>
              </div>
              {qnaLoading ? (
                <div className="text-gray-500">질문/답변을 불러오는 중...</div>
              ) : qnaList.length === 0 ? (
                <div className="text-gray-400">등록된 질문이 없습니다.</div>
              ) : (
                <div className="space-y-6">
                  {qnaList.map((item) => (
                    <div key={item.id} className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {item.displayName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{item.displayName}</p>
                            <p className="text-sm text-gray-500">{item.created_at?.slice(0,10)}</p>
                          </div>
                        </div>
                        <div className="text-gray-700 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: nl2brHtml(item.content) }} />
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">답글 {item.answers.length}</span>
                        </div>
                      </div>
                      {/* 답변 출력 */}
                      {item.answers.map((ans: any) => (
                        <div key={ans.id} className="ml-8 bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {ans.displayName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-blue-700">{ans.displayName}</p>
                              <p className="text-sm text-gray-500">{ans.created_at?.slice(0,10)}</p>
                            </div>
                            <Badge className="bg-blue-600 text-white text-xs">강사</Badge>
                          </div>
                          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: nl2brHtml(ans.content) }} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 커리큘럼 섹션 */}
            <div ref={curriculumRef} className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-6">커리큘럼</h3>
              {curriculumLoading ? (
                <div className="text-gray-500">커리큘럼을 불러오는 중...</div>
              ) : sessions.length === 0 ? (
                <div className="text-gray-400">등록된 커리큘럼이 없습니다.</div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session, idx) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg">
                      <div className="p-4 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{session.session_title}</h4>
                            {session.session_subtitle && <p className="text-sm text-gray-600">{session.session_subtitle}</p>}
                          </div>
                        </div>
                      </div>
                      {/* 하위 영상 목록 */}
                      <div className="p-4 space-y-2">
                        {videos.filter(v => v.session_id === session.id).length === 0 ? (
                          <div className="text-gray-400 text-sm">등록된 영상이 없습니다.</div>
                        ) : (
                          videos.filter(v => v.session_id === session.id).map((video, vidx) => (
                            <div key={video.id} className="text-sm text-gray-700 flex items-center gap-2 cursor-pointer hover:underline"
                              onClick={() => setSelectedVideoDetail(video)}>
                              <span className="font-bold">{vidx + 1}.</span>
                              <span>{video.video_title}</span>
                              {video.video_duration && (
                                <span className="text-xs text-gray-500 ml-2">({formatDuration(video.video_duration)})</span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 크리에이터 섹션 */}
            <div ref={creatorRef} className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-6">크리에이터</h3>
              <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-6 text-white mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{instructor?.name || '-'}</h3>
                    <p className="text-green-100">{instructor?.main_field || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">
                  <div dangerouslySetInnerHTML={{ __html: nl2brHtml(instructor?.introduction) }} />
                </h4>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-orange-600 flex items-center gap-2">
                    <span>🔥</span> 이력/경력
                  </h5>
                  <p className="text-sm text-gray-600 mt-2">
                    <span dangerouslySetInnerHTML={{ __html: nl2brHtml(instructor?.career) }} />
                  </p>
                </div>
              </div>
            </div>

            {/* 후기 섹션 */}
            <div ref={reviewsRef} className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-6">후기 {reviews.length.toLocaleString()}</h3>
              
              {/* 후기 입력 UI */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">후기 작성</h4>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">평점</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-2xl"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{reviewRating}/5</span>
                  </div>
                </div>
                <Textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="후기를 입력하세요 (최대 500자)"
                  maxLength={500}
                  className="mb-2"
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{reviewText.length}/500</span>
                  <Button onClick={handleReviewSubmit} disabled={!reviewText.trim() || reviewText.length > 500}>
                    후기 등록
                  </Button>
                </div>
              </div>
              
              {/* 후기 목록 */}
              {reviewsLoading ? (
                <div className="text-gray-500">후기를 불러오는 중...</div>
              ) : reviews.length === 0 ? (
                <div className="text-gray-400">등록된 후기가 없습니다.</div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {review.displayName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{review.displayName}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-3">{review.review}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleReviewLike(review.id)}>
                          <Heart className={`w-4 h-4 ${reviewLikes[review.id] ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                        <span className="text-sm text-gray-500">{review.likes || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 사이드바 구매 영역 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-24 z-10">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-4">수강 옵션</h3>
                
                <div className="border-2 border-blue-500 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">온라인 강의 ONLY</span>
                    <span className="text-xl font-bold">{lectureData.currentPrice.toLocaleString()}원</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">바로 수강 가능</p>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-lg font-bold mb-2">상품 금액</div>
                <div className="text-3xl font-bold">{lectureData.currentPrice.toLocaleString()}원</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <button 
                    onClick={handleLikeClick}
                    className={`flex items-center gap-2 text-gray-500 hover:text-red-500 ${isLiked ? 'font-bold' : ''}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-sm">{likeCount}</span>
                  </button>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                  size="lg"
                >
                  강의 구매하기
                </Button>
              </div>

              {/* 학습정책 및 환불규정 - 내용 수정 */}
              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => setShowCurriculum(!showCurriculum)}
                  className="w-full flex items-center justify-between text-sm text-gray-600 py-2"
                >
                  <span>학습정책</span>
                  {showCurriculum ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {showCurriculum && (
                  <div className="text-xs text-gray-600 space-y-3 max-h-96 overflow-y-auto">
                    <p>결제를 완료하시기 전 해당하는 학습 정책을 꼭 확인해주세요.</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">[온라인 강의 옵션]</p>
                        <div className="space-y-2">
                          <p>• <strong>학습 형태:</strong> 본 강의는 녹화된 동영상을 온라인으로 수강하시는 강의입니다.</p>
                          <p>• <strong>수강 방법:</strong> 마이페이지 → 내 강의실에 접속하여 수강하실 수 있습니다.</p>
                          <div className="ml-4 space-y-1">
                            <p>- [PC] 로그인 → 우측 상단 프로필 클릭 → 내 강의실</p>
                            <p>- [모바일] 로그인 → 우측 상단 메뉴(三) 클릭 → 내 강의실</p>
                          </div>
                          <p>• <strong>수강 기간:</strong> 정상 수강 기간(유료 수강 기간) 최초 14일, 무료 수강 기간은 14일이 제공됩니다.</p>
                          <p className="ml-4">내 강의실에 노출되는 수강 기간은 정상 수강 기간과 복습 수강 기간 모두 포함하는 전체 수강 기간이며, 이 기간 동안 자유롭게 학습할 수 있습니다.</p>
                          <p>• 강의 업로드 일정은 상세페이지 및 커리큘럼 제목을 참고해주세요.</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">[오프라인 강의 옵션]</p>
                        <div className="space-y-2">
                          <p>• <strong>학습 형태:</strong> 본 강의는 정해진 일정에 강의장에 방문하여 직접 현장 수강하는 강의입니다.</p>
                          <p>• <strong>수강 방법:</strong> 강의장 위치와 강의 일정을 상세페이지 안내 사항을 참고해주세요.</p>
                          <p>** 온라인 복습권이 제공되는 강의의 경우, 업로드 일정 및 수강 기간을 상세페이지 및 커리큘럼에서 확인하실 수 있습니다.</p>
                        </div>
                      </div>
                      
                      <p>* 더 상세한 수강 정책은 <span className="text-blue-600 underline cursor-pointer">여기를</span> 확인하세요.</p>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => setShowRefundPolicy(!showRefundPolicy)}
                  className="w-full flex items-center justify-between text-sm text-gray-600 py-2"
                >
                  <span>환불규정</span>
                  {showRefundPolicy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {showRefundPolicy && (
                  <div className="text-xs text-gray-600 space-y-3 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">[온라인]</p>
                        <div className="space-y-2">
                          <p>• 개강과 동시에 동영상이 업로드되는 Q&A 게시판, Q&A 댓글 및 코칭, 현장 동영상 구독 등이 포함된 강의는 개강 전부터 정성스럽게 제작이 시작되어 학습자가 바로 이용할 수 있습니다.</p>
                          <p>• 교재, 스터디가 포함된 강의는 교재 배송과 강사 배정에 따른 스터디 배정 진행을 위해 미리 선택하여 강사가 개별 신청합니다.</p>
                          <p>• 교재 · 스터디 포함 상품은 상품에서 환불을 신청하는 경우, 교재가 배송되거나 스터디 개강을 100% 수강한 것으로 간주됩니다.</p>
                          <p>• 스터디 포함상품 : 개강일 전 전액 환불 가능하며, 개강일 이후 스터디 부분은 환불 불가능합니다.</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">환불 기준:</p>
                        <div className="space-y-2">
                          <p><strong>1. 정상 수강 기간 시작 전 :</strong> 이미 지출한 수강료의 전액 환불</p>
                          <p><strong>2. 정상 수강 기간 중 환불 시 (수강료 · 위약금) 공제의 세부 기준</strong></p>
                          <p className="ml-4">* 수강료 산정에 있어 시청에 관계하지 않은 타임 세그먼트(정상) 포함을 전체 시간에서 시청한 시간의 비율로 산정하여 수강료를 계산합니다.</p>
                          <p className="ml-4">* 예를 들어 4차시의 수강료이며 30분 길이의 타임 세그먼트(정상) 총 15분만 시청한 상태였다면, 해당 타임 세그먼트(정상)에 대해서는 총 50%의 수강료이 산정됩니다.</p>
                          <p><strong>3. 정상 수강 기간별 환불 기준</strong></p>
                          <div className="ml-4 space-y-1">
                            <p>* 정상 수강 기간 1/3 경과 전 : 수강료의 2/3에 해당하는 금액 또는 (수강료 · 위약금) 공제의 세부 기준</p>
                            <p>* 정상 수강 기간 1/2 경과 전 : 수강료의 1/2에 해당하는 금액 또는 (수강료 · 위약금) 공제의 세부 기준</p>
                            <p>* 정상 수강 기간 1/2 경과 후 : 환불 금액 없음</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">[오프라인]</p>
                        <div className="space-y-2">
                          <p>• 오프라인 단과 강의는 1회만 진행되는 현장 강의입니다.</p>
                          <p>• 결제 당일부터 강의일 7일 전 : 전액 환불</p>
                          <p>• 강의일 6일~3일 전까지 : 20% 공제 후 환불</p>
                          <p>• 강의일 2일~1일 전까지 : 30% 공제 후 환불</p>
                          <p>• 강의 당일 강의 시작 전까지 : 90% 공제 후 환불</p>
                          <p>• 강의 시작 이후 또는 불참 : 환불 금액 없음</p>
                          <p className="text-red-600">* 오프라인 단과 강의의 경우 사전 현장 준비 및 장소, 참석 인원 마케팅에 대한 비용으로 개최 직전부터 결제금의 일부가 이미 영업비로 차감되어 환불이 불가한 수 있습니다. 위에 규정된 규정 외 일회성 환불정책의 일부가 불가능할 수 있습니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* YouTube 플레이어 모달 */}
      {selectedVideo && (
        <YouTubePlayer
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
      )}
      
      {/* 영상 상세 모달 */}
      {selectedVideoDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setSelectedVideoDetail(null)}>
              닫기
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedVideoDetail.video_title}</h3>
            {selectedVideoDetail.video_subtitle && (
              <div className="text-sm text-gray-600 mb-2">{selectedVideoDetail.video_subtitle}</div>
            )}
            <div className="text-xs text-gray-500 mb-2">
              {formatDuration(selectedVideoDetail.video_duration)}
            </div>
            <div className="text-gray-700 mb-2">{selectedVideoDetail.video_description}</div>
            {selectedVideoDetail.video_url && canPlayVideo ? (
              <video src={selectedVideoDetail.video_url} controls className="w-full rounded" />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded text-gray-400">
                동영상은 수강중인 회원만 재생할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default LectureDetailPage;
