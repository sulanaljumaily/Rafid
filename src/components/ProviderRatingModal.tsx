import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, X, CheckCircle2, User, MessageSquare, Award } from 'lucide-react';

interface ProviderRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string; // listingId or serviceId
  targetTitle: string;
  providerName: string;
  onSubmitRating: (data: {
    listingId: string;
    rating: number;
    comment: string;
    reviewerName: string;
  }) => void;
}

export default function ProviderRatingModal({
  isOpen,
  onClose,
  targetId,
  targetTitle,
  providerName,
  onSubmitRating
}: ProviderRatingModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('يرجى اختيار عدد النجوم للتقييم');
      return;
    }

    onSubmitRating({
      listingId: targetId,
      rating,
      comment: comment || 'تقييم ممتازة وخدمة جيدة جداً.',
      reviewerName: reviewerName || 'مستأجر رافد'
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6 relative font-sans text-right"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">شكراً لتقييمك المباشر!</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تم تحديث متوسط التقييم العام لـ ({providerName}) ودخوله في قاعدة بيانات منصة رافد بنجاح.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-700 rounded-full text-[10px] font-black">
                <Award className="h-3.5 w-3.5" />
                <span>تقييم الخدمة بعد انتهاء الاستئجار</span>
              </div>
              <h2 className="text-sm font-black text-slate-900">{targetTitle}</h2>
              <p className="text-xs text-slate-500">مالك الآلية: <span className="font-bold text-slate-800">{providerName}</span></p>
            </div>

            {/* Interactive Stars */}
            <div className="space-y-2 text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-700 block">حدد درجتك لتقييم أداء الآلية والمشغل:</span>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-black text-amber-600 block">
                {rating === 5 ? 'ممتاز جداً (5/5) ★★★★★' :
                 rating === 4 ? 'جيد جداً (4/5) ★★★★' :
                 rating === 3 ? 'متوسط (3/5) ★★★' :
                 rating === 2 ? 'مقبول (2/5) ★★' : 'ضعيف (1/5) ★'}
              </span>
            </div>

            {/* Customer Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <User className="h-3 w-3 text-slate-400" />
                <span>اسمك أو اسم شركتك (اختياري):</span>
              </label>
              <input
                type="text"
                placeholder="مثال: م. علي الجبوري"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Comment */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-slate-400" />
                <span>ملاحظاتك وانطباعك عن العمل:</span>
              </label>
              <textarea
                rows={3}
                placeholder="اكتب انطباعك عن سرعة الاستجابة، حالة المعدة، والتزام السائق بالوقت..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs py-2.5 rounded-xl transition shadow-md cursor-pointer"
            >
              إرسال التقييم وتحديث متوسط البيانات
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
