import { useState } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight, RotateCcw } from 'lucide-react'
import LottieAnimation from './LottieAnimation'
import TermsOfService from '../pages/TermsOfService'

// --- Types ---
type Question = {
    id: number
    text: string
}

type UserProfile = {
    name: string
    university: string
    phone: string
    email: string
}

// --- Questions Data ---
const QUESTIONS: Question[] = [
    { id: 1, text: '働くなら、やっぱり都会（東京・大阪など）に出たい？' },
    { id: 2, text: '誰も知らない『隠れ優良企業』なら、名前は知らなくても興味ある？' },
    { id: 3, text: '人と話すよりも、モノづくりや専門スキルを磨く方が好き？' },
    { id: 4, text: 'IT・Web業界のスピード感ある環境に憧れる？' },
    { id: 5, text: 'ぶっちゃけ、今の自分の就活状況に『焦り』を感じている？' },
    { id: 6, text: '自己分析や企業探し、一人でやるのは正直しんどい？' },
    { id: 7, text: 'できれば、1〜2ヶ月以内には内定を決めて安心したい？' },
    { id: 8, text: 'プロがあなたに合った企業を提案してくれるなら、話を聞いてみたい？' },
]

export default function JobMatchingPrototype() {
    const [step, setStep] = useState<'landing' | 'questions' | 'form' | 'completion'>('landing')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<boolean[]>([])

    // Form State
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        university: '',
        phone: '',
        email: ''
    })
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
    const [showTerms, setShowTerms] = useState(false)

    // --- Handlers ---

    const startDiagnosis = () => {
        setStep('questions')
    }

    const handleAnswer = (isYes: boolean) => {
        const newAnswers = [...answers, isYes]
        setAnswers(newAnswers)

        if (currentQuestionIndex < QUESTIONS.length - 1) {
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
        if (!agreedToPrivacy) {
            alert('個人情報の取扱いに同意してください')
            return
        }

        try {
            const response = await fetch('/api/submit.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers: answers,
                    contact: {
                        name: profile.name,
                        school: profile.university,
                        phone: profile.phone,
                        email: profile.email
                    },
                    consent: agreedToPrivacy
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'エラーが発生しました')
            }

            // Console Log as requested
            console.log('--- Diagnosis Complete ---')
            console.log('Server Response:', data)

            setStep('completion')
        } catch (error) {
            console.error('Submission Error:', error)
            alert(error instanceof Error ? error.message : '通信エラーが発生しました')
        }
    }

    // --- Render Steps ---

    return (
        <div className="h-[100dvh] w-full bg-[#f0f2f5] text-gray-800 font-sans flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden fixed inset-0">
            <div className="w-full max-w-md bg-white h-full sm:h-[85vh] sm:max-h-[900px] sm:min-h-[600px] sm:rounded-[32px] sm:shadow-2xl relative overflow-hidden flex flex-col">

                {/* Header / Brand - Now Relative in Flow */}
                <header className="p-6 flex items-center justify-center z-10">
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
                                        className="bg-primary text-white font-bold py-4 px-12 rounded-full shadow-lg text-lg flex items-center gap-2"
                                    >
                                        スタート <ArrowRight size={20} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* 2. Swipe Question Screen */}
                        {step === 'questions' && (
                            <QuestionScreen
                                key="questions"
                                question={QUESTIONS[currentQuestionIndex]}
                                index={currentQuestionIndex}
                                total={QUESTIONS.length}
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
                                        disabled={!agreedToPrivacy}
                                        className={`w-full font-bold py-3 rounded-xl shadow-lg mt-1 transition-all text-sm ${agreedToPrivacy
                                            ? 'bg-primary text-white active:scale-95 shadow-primary/30'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        完了して待つ
                                    </button>
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
    onAnswer: (a: boolean) => void
    onBack: () => void
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

            {/* Card Area - Flex Center */}
            <div className="relative w-full max-w-[340px] aspect-[3/4] flex items-center justify-center">
                {/* Card Component */}
                <motion.div
                    className="absolute w-full h-full bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center cursor-grab active:cursor-grabbing z-10"
                    style={{ x, rotate }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    initial={{ scale: 0.95, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{
                        x: x.get() < 0 ? -500 : 500,
                        opacity: 0,
                        transition: { duration: 0.2 }
                    }}
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
            </div>

            <div className="mt-8 flex gap-4">
                <button className="w-14 h-14 rounded-full bg-white shadow-lg text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors" onClick={() => onAnswer(false)}>
                    <X />
                </button>
                <button className="w-14 h-14 rounded-full bg-white shadow-lg text-green-500 flex items-center justify-center hover:bg-green-50 transition-colors" onClick={() => onAnswer(true)}>
                    <Check />
                </button>
            </div>

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
