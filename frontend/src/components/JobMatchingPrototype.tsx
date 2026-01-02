import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight, RotateCcw, Mail, Send } from 'lucide-react'
import LottieAnimation from './LottieAnimation'
import TermsOfService from '../pages/TermsOfService'

// --- Types ---
type QuestionType = 'swipe' | 'selection'

type Question = {
    id: number
    text: string
    type: QuestionType
    options?: string[]
}

type UserProfile = {
    name: string
    university: string
    phone: string
    email: string
}

export default function JobMatchingPrototype() {
    const [step, setStep] = useState<'landing' | 'questions' | 'form' | 'completion' | 'contact'>('landing')
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<(boolean | string)[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        university: '',
        phone: '',
        email: ''
    })
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
    const [showTerms, setShowTerms] = useState(false)

    // API State
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

    // --- Data Fetching ---
    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/questions.php')
                const data = await response.json()
                if (data.questions) {
                    setQuestions(data.questions)
                }
            } catch (error) {
                console.error('Failed to fetch questions:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuestions()
    }, [])

    // --- Handlers ---

    const startDiagnosis = () => {
        if (questions.length === 0) {
            alert('質問データの読み込みに失敗しました。リロードしてください。')
            return
        }
        setStep('questions')
    }

    const handleAnswer = (answer: boolean | string) => {
        const newAnswers = [...answers, answer]
        setAnswers(newAnswers)

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1)
        } else {
            setTimeout(() => setStep('form'), 300) // Small delay for animation
        }
    }

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setAnswers((prev) => prev.slice(0, -1))
            setCurrentQuestionIndex((prev) => prev - 1)
        }
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitError(null);

        if (!agreedToPrivacy) {
            alert('個人情報の取扱いに同意してください')
            return
        }

        setIsSubmitting(true);

        try {
            // Construct payload matching submit.php expectation
            const payload = {
                answers: answers,
                contact: {
                    name: profile.name,
                    school: profile.university,
                    phone: profile.phone,
                    email: profile.email
                },
                consent: true
            };

            const response = await fetch(`${API_BASE}/submit.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || '送信に失敗しました');
            }

            console.log('--- Submission Successful ---', data);
            setStep('completion');

        } catch (error: any) {
            console.error('Submission failed:', error);
            setSubmitError(error.message || '送信エラーが発生しました。');
            alert(error.message || '送信エラーが発生しました。');
        } finally {
            setIsSubmitting(false);
        }
    }

    // --- Contact Form Logic (Inline for simplicity) ---
    const [contactSubject, setContactSubject] = useState('')
    const [contactContent, setContactContent] = useState('')
    const [contactEmail, setContactEmail] = useState('') // Optional
    const [isContactSending, setIsContactSending] = useState(false)
    const [contactSent, setContactSent] = useState(false)

    const handleContactSend = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsContactSending(true)
        try {
            const res = await fetch(`${API_BASE}/contact.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: contactSubject,
                    content: contactContent,
                    email: contactEmail
                })
            })
            const data = await res.json()
            if (!res.ok || !data.ok) throw new Error(data.error || '送信失敗')

            setContactSent(true)
        } catch (err: any) {
            alert(err.message || 'エラーが発生しました')
        } finally {
            setIsContactSending(false)
        }
    }

    // --- Render Steps ---

    return (
        <div className="h-[100dvh] w-full bg-[#f0f2f5] text-gray-800 font-sans flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden fixed inset-0">
            <div className="w-full max-w-md bg-white h-full sm:h-[85vh] sm:max-h-[900px] sm:min-h-[600px] sm:rounded-[32px] sm:shadow-2xl relative overflow-hidden flex flex-col">

                {/* Header / Brand - Now Relative in Flow */}
                <header className="p-6 flex items-center justify-center z-10 relative">
                    {/* Back Button for non-landing steps */}
                    {step !== 'landing' && (
                        <button
                            onClick={() => {
                                if (step === 'contact' && contactSent) {
                                    setStep('landing')
                                    setContactSent(false)
                                    setContactSubject('')
                                    setContactContent('')
                                    setContactEmail('')
                                } else if (step === 'contact') {
                                    setStep('landing')
                                } else if (step === 'completion') {
                                    setStep('landing')
                                    // Reset state if needed
                                } else {
                                    // Default behavior for other steps? 
                                    // Maybe disable for questionnaire flow to avoid losing state easily
                                    // but for Contact it makes sense to go back.
                                }
                            }}
                            className={`absolute left-6 text-gray-400 hover:text-gray-600 ${step === 'questions' ? 'hidden' : ''}`}
                        >
                            {step === 'contact' || step === 'completion' ? <RotateCcw size={20} /> : null}
                        </button>
                    )}

                    {step !== 'landing' && <span className="text-primary font-bold text-sm tracking-wider">AGENT MATCH</span>}
                </header>

                <main className="flex-1 flex flex-col relative w-full min-h-0">
                    <AnimatePresence mode="wait">

                        {/* 1. Landing Screen */}
                        {step === 'landing' && (
                            <motion.div
                                key="landing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex-1 w-full overflow-y-auto min-h-0 no-scrollbar"
                            >
                                <div className="flex flex-col items-center p-8 text-center space-y-8 min-h-full">
                                    <div className="space-y-4">
                                        <h1 className="text-3xl font-bold text-primary">就活エージェント<br />マッチング</h1>
                                        <p className="text-gray-500 leading-relaxed">
                                            あなたの志向や状況に合わせて、<br />
                                            最適なエージェントを提案します。
                                        </p>
                                    </div>

                                    {/* Service Flow Section */}
                                    <ServiceFlow />

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startDiagnosis}
                                        disabled={isLoading} // Disable if loading
                                        className={`font-bold py-4 px-12 rounded-full shadow-lg text-lg flex items-center gap-2 ${isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white'}`}
                                    >
                                        {isLoading ? '読み込み中...' : 'スタート'} {!isLoading && <ArrowRight size={20} />}
                                    </motion.button>

                                    {/* Contact FAB */}
                                    <div className="fixed bottom-6 right-6 z-50 sm:absolute sm:bottom-8 sm:right-8">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setStep('contact')}
                                            className="w-14 h-14 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
                                        >
                                            <Mail size={24} />
                                        </motion.button>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            お問い合わせ
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 2. Swipe Question Screen */}
                        {step === 'questions' && questions.length > 0 && (
                            <QuestionScreen
                                key="questions"
                                question={questions[currentQuestionIndex]}
                                index={currentQuestionIndex}
                                total={questions.length}
                                onAnswer={handleAnswer}
                                onBack={handleBack}
                            />
                        )}

                        {/* 3. Lead Generation Form */}
                        {step === 'form' && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col p-6 overflow-y-auto"
                            >
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">入力ありがとうございます</h2>
                                    <p className="text-gray-500 text-xs">マッチするエージェントを探します。<br />連絡先と大学名を入力してください。</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">お名前</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                            placeholder="山田 太郎"
                                            value={profile.name}
                                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">大学名</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                            placeholder="〇〇大学"
                                            value={profile.university}
                                            onChange={e => setProfile({ ...profile, university: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">電話番号</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                            placeholder="090-1234-5678"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">メールアドレス</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                            placeholder="example@email.com"
                                            value={profile.email}
                                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2 pt-1">
                                        <label className="flex items-start gap-2 cursor-pointer group">
                                            <div className="relative flex items-center mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded checked:bg-primary checked:border-primary transition-colors"
                                                    checked={agreedToPrivacy}
                                                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                                                />
                                                <Check
                                                    size={12}
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                                                />
                                            </div>
                                            <span className="text-xs text-gray-600 leading-tight group-hover:text-gray-900 transition-colors">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setShowTerms(true);
                                                    }}
                                                    className="underline text-primary hover:text-primary/80 outline-none focus:ring-2 focus:ring-primary/20 rounded"
                                                >
                                                    個人情報の取扱い
                                                </button>
                                                について同意する
                                            </span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!agreedToPrivacy || isSubmitting}
                                        className={`w-full font-bold py-3 rounded-xl shadow-lg mt-1 transition-all text-sm ${agreedToPrivacy && !isSubmitting
                                            ? 'bg-primary text-white active:scale-95 shadow-primary/30'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isSubmitting ? '送信中...' : '完了して待つ'}
                                    </button>
                                    {submitError && <p className="text-red-500 text-xs text-center mt-2">{submitError}</p>}
                                </form>
                            </motion.div>
                        )}

                        {/* 4. Completion Screen */}
                        {step === 'completion' && (
                            <motion.div
                                key="completion"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="mb-6">
                                    <LottieAnimation width={240} height={240} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">受付完了</h2>
                                <p className="text-gray-500 leading-relaxed">
                                    あなたにマッチするエージェントから<br />連絡が来ます。<br />しばらくお待ちください。
                                </p>
                            </motion.div>
                        )}

                        {/* 5. Contact Form Screen */}
                        {step === 'contact' && (
                            <motion.div
                                key="contact"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="flex-1 flex flex-col p-6 overflow-y-auto"
                            >
                                {contactSent ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                                            <Check size={40} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">送信完了</h2>
                                        <p className="text-gray-500 text-sm">お問い合わせありがとうございます。<br />内容を確認次第、担当者よりご連絡いたします。</p>
                                        <button
                                            onClick={() => {
                                                setStep('landing')
                                                setContactSent(false)
                                            }}
                                            className="bg-gray-100 text-gray-600 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            トップへ戻る
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <h2 className="text-xl font-bold text-gray-900 mb-1">お問い合わせ</h2>
                                            <p className="text-gray-500 text-xs">ご質問やご不明点がございましたら、<br />お気軽にお問い合わせください。</p>
                                        </div>

                                        <form onSubmit={handleContactSend} className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-700">件名 <span className="text-red-500">*</span></label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                                    placeholder="例：サービスの利用について"
                                                    value={contactSubject}
                                                    onChange={e => setContactSubject(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-700">メールアドレス <span className="text-gray-400 font-normal">(任意)</span></label>
                                                <input
                                                    type="email"
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                                    placeholder="返信をご希望の場合は入力ください"
                                                    value={contactEmail}
                                                    onChange={e => setContactEmail(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-700">お問い合わせ内容 <span className="text-red-500">*</span></label>
                                                <textarea
                                                    required
                                                    rows={6}
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
                                                    placeholder="お問い合わせ内容をご記入ください..."
                                                    value={contactContent}
                                                    onChange={e => setContactContent(e.target.value)}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isContactSending || !contactSubject || !contactContent}
                                                className={`w-full font-bold py-3.5 rounded-xl shadow-lg mt-2 transition-all text-sm flex items-center justify-center gap-2 ${(!contactSubject || !contactContent || isContactSending)
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-primary text-white active:scale-95 shadow-primary/30'
                                                    }`}
                                            >
                                                {isContactSending ? '送信中...' : '送信する'}
                                                {!isContactSending && <Send size={16} />}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </main>

                {/* Terms of Service Overlay */}
                <AnimatePresence>
                    {showTerms && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed inset-0 z-50 overflow-y-auto bg-gray-50 bg-opacity-95" // Added bg-opacity to ensure it covers well but possibly allow seeing behind if desired, though standard modal usu opaque or dimmed. TermsOfService has its own bg.
                        >
                            <TermsOfService onClose={() => setShowTerms(false)} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    )
}

// --- Sub-Components ---

function QuestionScreen({
    question,
    index,
    total,
    onAnswer,
    onBack
}: {
    question: Question
    index: number
    total: number
    onAnswer: (a: boolean | string) => void
    onBack: () => void
}) {
    const [exitDirection, setExitDirection] = useState(0)

    const handleAnswer = (val: boolean | string) => {
        if (typeof val === 'boolean') {
            setExitDirection(val ? 1 : -1)
        } else {
            setExitDirection(1)
        }
        onAnswer(val)
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-full overflow-hidden pb-8">

            {/* Progress - Relative Flow */}
            <div className="w-full px-12 mb-8">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((index + 1) / total) * 100}%` }}
                    />
                </div>
                <p className="text-center text-xs text-gray-400 mt-2 font-mono">{index + 1} / {total}</p>
            </div>

            {/* Content Area */}
            <div className="relative w-full max-w-[340px] aspect-[3/4] flex items-center justify-center">
                <AnimatePresence mode="wait" custom={exitDirection}>
                    {question.type === 'selection' ? (
                        <SelectionView
                            key={`q-${question.id}`}
                            question={question}
                            onAnswer={handleAnswer}
                        />
                    ) : (
                        <SwipeView
                            key={`q-${question.id}`}
                            question={question}
                            onAnswer={handleAnswer}
                            custom={exitDirection}
                        />
                    )}
                </AnimatePresence>
            </div>

            <ActionsArea question={question} onAnswer={handleAnswer as (val: boolean) => void} />

            {/* Back Button */}
            <div className="mt-6">
                <button
                    onClick={onBack}
                    disabled={index === 0}
                    className={`flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors ${index === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <RotateCcw size={16} />
                    <span>前に戻る</span>
                </button>
            </div>
        </div>
    )
}

function SelectionView({
    question,
    onAnswer
}: {
    question: Question
    onAnswer: (val: string) => void
}) {
    return (
        <motion.div
            className="w-full h-full bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center p-6 z-10"
            initial={{ scale: 0.95, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            <h3 className="text-xl font-bold text-gray-800 leading-relaxed text-center mb-6">
                {question.text}
            </h3>

            <div className="w-full flex-1 flex flex-col gap-3 justify-center overflow-y-auto no-scrollbar">
                {question.options?.map((option) => (
                    <motion.button
                        key={option}
                        whileHover={{ scale: 1.02, backgroundColor: '#f3f4f6' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAnswer(option)}
                        className="w-full p-4 rounded-xl border-2 border-gray-100 text-left font-bold text-gray-700 hover:border-primary/30 transition-colors flex items-center justify-between group"
                    >
                        <span>{option}</span>
                        <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}

function SwipeView({
    question,
    onAnswer,
    custom
}: {
    question: Question
    onAnswer: (val: boolean) => void
    custom?: number
}) {
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-30, 30])
    const opacityYes = useTransform(x, [0, 150], [0, 1])
    const opacityNo = useTransform(x, [0, -150], [0, 1])

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 100) {
            onAnswer(true)
        } else if (info.offset.x < -100) {
            onAnswer(false)
        }
    }

    const variants = {
        enter: { scale: 0.95, opacity: 0, y: 50 },
        center: { scale: 1, opacity: 1, y: 0 },
        exit: (direction: number) => ({
            x: direction < 0 ? -500 : 500,
            opacity: 0,
            transition: { duration: 0.2 }
        })
    }

    return (
        <>
            <motion.div
                className="absolute w-full h-full bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center cursor-grab active:cursor-grabbing z-10"
                style={{ x, rotate }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                variants={variants}
                custom={custom}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <h3 className="text-xl font-bold text-gray-800 leading-relaxed select-none">
                    {question.text}
                </h3>

                <div className="absolute bottom-8 text-gray-400 text-sm flex gap-8 select-none">
                    <div className="flex items-center gap-1"><span className="text-red-400">←</span> NO</div>
                    <div className="flex items-center gap-1">YES <span className="text-green-500">→</span></div>
                </div>

                {/* Overlays */}
                <motion.div
                    style={{ opacity: opacityYes }}
                    className="absolute inset-0 bg-green-500/10 rounded-3xl flex items-center justify-center pointer-events-none"
                >
                    <div className="border-4 border-green-500 text-green-500 font-bold text-4xl px-4 py-2 rounded -rotate-12 bg-white/50">
                        YES
                    </div>
                </motion.div>

                <motion.div
                    style={{ opacity: opacityNo }}
                    className="absolute inset-0 bg-red-500/10 rounded-3xl flex items-center justify-center pointer-events-none"
                >
                    <div className="border-4 border-red-500 text-red-500 font-bold text-4xl px-4 py-2 rounded rotate-12 bg-white/50">
                        NO
                    </div>
                </motion.div>

            </motion.div>

            {/* Background Card for Scale Effect (Optional aesthetic) */}
            <div className="absolute w-[90%] h-[90%] bg-gray-50 rounded-3xl -z-10 translate-y-3" />
        </>
    )
}

function ActionsArea({ question, onAnswer }: { question: Question, onAnswer: (val: boolean) => void }) {
    if (question.type !== 'swipe') return <div className="h-14 mt-8" /> // Spacer to keep layout stable

    return (
        <div className="mt-8 flex gap-4">
            <button className="w-14 h-14 rounded-full bg-white shadow-lg text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors" onClick={() => onAnswer(false)}>
                <X />
            </button>
            <button className="w-14 h-14 rounded-full bg-white shadow-lg text-green-500 flex items-center justify-center hover:bg-green-50 transition-colors" onClick={() => onAnswer(true)}>
                <Check />
            </button>
        </div>
    )
}

function ServiceFlow() {
    const steps = [
        {
            title: "簡単10問回答",
            desc: "スマホでサクサク！\nあなたの志向を教えてください",
            img: "/images/step1_questions.png"
        },
        {
            title: "マッチング",
            desc: "AIとプロの視点で\n最適な企業・エージェントを分析",
            img: "/images/step2_matching.png"
        },
        {
            title: "エージェント紹介",
            desc: "あなたにぴったりの\n担当者と出会えます",
            img: "/images/step3_agent.png"
        }
    ]

    return (
        <div className="w-full max-w-lg mx-auto my-6 px-2">
            <div className="flex flex-col gap-8 md:flex-row md:gap-4 justify-center items-stretch">
                {steps.map((step, i) => (
                    <div key={i} className="flex-1 min-w-[140px] flex flex-col items-center relative group">

                        {/* Connecting Line (Mobile: Down, Desktop: Right) - except last item */}
                        {i < steps.length - 1 && (
                            <>
                                <div className="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-gray-200 md:hidden" />
                                <div className="absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-200 hidden md:block" />
                            </>
                        )}

                        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 w-full h-full flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
                            <div className="w-24 h-24 mb-3 relative">
                                <img
                                    src={step.img}
                                    alt={step.title}
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute -top-2 -left-2 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                                    {i + 1}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2 whitespace-nowrap">
                                {step.title}
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
