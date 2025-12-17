import type React from 'react'
import { useEffect, useRef, useState } from 'react'

type Question = {
    id: string
    title: string
    type: 'single'
    options: string[]
    required: boolean
}

type Contact = {
    name: string
    school: string
    phone: string
    email: string
}

const CONSENT_TEXT =
    '提携する就活エージェントへ回答内容と連絡先を提供し、エージェントから連絡を受け取ることに同意します'
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

function SurveyPage() {
    const [phase, setPhase] = useState<'questions' | 'contact' | 'complete'>('questions')
    const [questions, setQuestions] = useState<Question[]>([])
    const [loadingQuestions, setLoadingQuestions] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [dragOffset, setDragOffset] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const startXRef = useRef<number | null>(null)

    const [contact, setContact] = useState<Contact>({
        name: '',
        school: '',
        phone: '',
        email: '',
    })
    const [consent, setConsent] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoadingQuestions(true)
                setFetchError(null)
                const res = await fetch(`${API_BASE}/questions.php`)
                if (!res.ok) {
                    throw new Error('質問の取得に失敗しました')
                }
                const data = (await res.json()) as { questions: Question[] }
                setQuestions(data.questions || [])
            } catch (e) {
                console.error(e)
                setFetchError('質問の読み込みに失敗しました。リロードしてください。')
            } finally {
                setLoadingQuestions(false)
            }
        }
        fetchQuestions()
    }, [])

    const currentQuestion = questions[currentIndex]
    const progressText =
        questions.length > 0 ? `${Math.min(currentIndex + 1, questions.length)}/${questions.length}` : ''

    const handleAnswer = (value: string) => {
        if (!currentQuestion) return
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
        if (currentIndex + 1 >= questions.length) {
            setPhase('contact')
        } else {
            setCurrentIndex((prev) => prev + 1)
        }
        setDragOffset(0)
        setIsAnimating(false)
    }

    const handleSkip = () => {
        if (!currentQuestion || currentQuestion.required) return
        if (currentIndex + 1 >= questions.length) {
            setPhase('contact')
        } else {
            setCurrentIndex((prev) => prev + 1)
        }
        setDragOffset(0)
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!currentQuestion) return
        if (currentQuestion.options.length !== 2) return
        startXRef.current = event.clientX
        setIsAnimating(false)
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!currentQuestion) return
        if (startXRef.current === null) return
        const delta = event.clientX - startXRef.current
        setDragOffset(delta)
    }

    const handlePointerUp = () => {
        if (!currentQuestion) return
        if (startXRef.current === null) return
        const delta = dragOffset
        const threshold = 80
        if (Math.abs(delta) > threshold && currentQuestion.options.length >= 2) {
            const selected = delta < 0 ? currentQuestion.options[0] : currentQuestion.options[1]
            setIsAnimating(true)
            setDragOffset(delta < 0 ? -500 : 500)
            setTimeout(() => handleAnswer(selected), 150)
        } else {
            setIsAnimating(true)
            setDragOffset(0)
            setTimeout(() => setIsAnimating(false), 120)
        }
        startXRef.current = null
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitError(null)
        if (!contact.name.trim() || !contact.school.trim()) {
            setSubmitError('名前と学校は必須です')
            return
        }
        if (!contact.phone.trim() && !contact.email.trim()) {
            setSubmitError('電話番号かメールアドレスのどちらかを入力してください')
            return
        }
        if (!consent) {
            setSubmitError('同意にチェックしてください')
            return
        }

        try {
            setSubmitting(true)
            const res = await fetch(`${API_BASE}/submit.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    contact,
                    consent: true,
                }),
            })
            const data = await res.json()
            if (!res.ok || !data.ok) {
                throw new Error(data.error || '送信に失敗しました')
            }
            setPhase('complete')
        } catch (e) {
            console.error(e)
            setSubmitError(e instanceof Error ? e.message : '送信に失敗しました')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="page" style={{ justifyContent: 'center' }}>
            {/* 
        Note: Removed the hero section. 
        Adjusted layout to center the content since there's no hero.
        See if class 'page' behaves well without hero. 
      */}

            {phase === 'questions' && (
                <section className="section">
                    <div className="card-shell">
                        <div className="progress">
                            <span>質問</span>
                            <strong>{progressText}</strong>
                        </div>
                        {loadingQuestions && <div className="card loading">読み込み中…</div>}
                        {fetchError && <div className="card error">{fetchError}</div>}
                        {!loadingQuestions && currentQuestion && (
                            <>
                                <div
                                    className={`card question-card ${isAnimating ? 'animating' : ''}`}
                                    style={{
                                        transform: `translateX(${dragOffset}px) rotate(${dragOffset / 25}deg)`,
                                        transition: isAnimating ? 'transform 0.15s ease-out' : 'none',
                                    }}
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerCancel={handlePointerUp}
                                    role="presentation"
                                >
                                    <p className="question-title">{currentQuestion.title}</p>
                                    <div className="options">
                                        {currentQuestion.options.map((opt) => (
                                            <button
                                                key={opt}
                                                className="option-button"
                                                onClick={() => handleAnswer(opt)}
                                                type="button"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    {currentQuestion.options.length === 2 && (
                                        <div className="swipe-hint">
                                            <span>左へスワイプ：{currentQuestion.options[0]}</span>
                                            <span>右へスワイプ：{currentQuestion.options[1]}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="actions">
                                    {!currentQuestion.required && (
                                        <button className="ghost" onClick={handleSkip} type="button">
                                            スキップ
                                        </button>
                                    )}
                                    {currentQuestion.options.length === 2 && (
                                        <div className="helper">スワイプできない場合はボタンをタップしてください</div>
                                    )}
                                </div>
                            </>
                        )}
                        {!loadingQuestions && !currentQuestion && !fetchError && (
                            <div className="card">質問が見つかりませんでした。</div>
                        )}
                    </div>
                </section>
            )}

            {phase === 'contact' && (
                <section className="section">
                    <div className="card-shell">
                        <div className="progress">
                            <span>連絡先入力</span>
                        </div>
                        <form className="card form-card" onSubmit={handleSubmit}>
                            <label className="field">
                                <span>名前（必須）</span>
                                <input
                                    type="text"
                                    value={contact.name}
                                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                    required
                                />
                            </label>
                            <label className="field">
                                <span>学校（必須）</span>
                                <input
                                    type="text"
                                    value={contact.school}
                                    onChange={(e) => setContact({ ...contact, school: e.target.value })}
                                    required
                                />
                            </label>
                            <label className="field">
                                <span>電話番号（どちらか必須）</span>
                                <input
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                    placeholder="090-1234-5678"
                                />
                            </label>
                            <label className="field">
                                <span>メールアドレス（どちらか必須）</span>
                                <input
                                    type="email"
                                    value={contact.email}
                                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                    placeholder="example@mail.com"
                                />
                            </label>
                            <label className="consent">
                                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                                <span>{CONSENT_TEXT}</span>
                            </label>
                            {submitError && <div className="error">{submitError}</div>}
                            <button className="primary wide" type="submit" disabled={submitting}>
                                {submitting ? '送信中…' : '送信する'}
                            </button>
                        </form>
                    </div>
                </section>
            )}

            {phase === 'complete' && (
                <section className="section">
                    <div className="card-shell">
                        <div className="card complete-card">
                            <p className="complete-heading">送信が完了しました</p>
                            <p className="complete-text">
                                あなたにマッチするエージェントから連絡が来ます。しばらくお待ちください。
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default SurveyPage
