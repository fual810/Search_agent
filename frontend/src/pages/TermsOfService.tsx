import React from 'react';
import { X, ArrowUp } from 'lucide-react';

interface TermsOfServiceProps {
    onClose?: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onClose }) => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden relative">
                {/* Header / Close Button */}
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex justify-between items-center p-4 sm:p-6 shadow-sm">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        利用規約
                    </h1>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            aria-label="閉じる"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-10 space-y-8 leading-relaxed text-sm sm:text-base">

                    <section>
                        <div className="mb-4">
                            <p className="font-bold mb-2">【Swipe Match】 利用規約</p>
                            <p>
                                この利用規約（以下「本規約」といいます。）は、AchoSystems（代表：古河 遼）（以下「運営者」といいます。）が提供する就職活動支援プラットフォーム「Swipe Match」（以下「本サービス」といいます。）の利用条件を定めるものです。本サービスを利用するユーザー（以下「ユーザー」といいます。）は、本規約に同意した上で利用するものとします。
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 border-l-4 border-indigo-500 pl-3">第1条（適用）</h2>
                        <p>
                            本規約は、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されるものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 border-l-4 border-indigo-500 pl-3">第2条（本サービスの内容と位置付け）</h2>
                        <div className="pl-2">
                            <ol className="list-decimal list-outside pl-5 space-y-2">
                                <li>本サービスは、ユーザーが入力した診断結果等の情報に基づき、ユーザーに適していると思われる提携職業紹介事業者（以下「提携エージェント」といいます。）の情報を提供し、マッチングの機会を提供するサービスです。</li>
                                <li>運営者は、職業安定法に規定される「職業紹介事業（雇用関係の成立をあっせんすること）」を行うものではありません。面接の日程調整、選考結果の通知、雇用条件の交渉等は、すべて提携エージェントとユーザーの間で直接行われるものとし、運営者はこれらに一切関与しません。</li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 border-l-4 border-indigo-500 pl-3">第3条（利用登録・診断）</h2>
                        <div className="pl-2">
                            <ol className="list-decimal list-outside pl-5 space-y-2">
                                <li>ユーザーは、本規約に同意の上、運営者の定める方法（スワイプ診断およびフォーム入力）により、正確な情報を登録するものとします。</li>
                                <li>
                                    ユーザーが以下のいずれかに該当する場合、運営者は利用を断る、または登録を抹消することがあります。
                                    <ul className="list-disc list-outside pl-5 mt-1 space-y-1 text-gray-600">
                                        <li>登録事項に虚偽の事実がある場合</li>
                                        <li>過去に本規約違反等により利用停止処分を受けている場合</li>
                                        <li>その他、運営者が利用を不適当と判断した場合</li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 border-l-4 border-indigo-500 pl-3">第4条（個人情報の取扱い・第三者提供の同意）</h2>
                        <div className="pl-2">
                            <ol className="list-decimal list-outside pl-5 space-y-2">
                                <li>運営者は、ユーザーの個人情報を、別途定める「プライバシーポリシー」に従い適切に取り扱います。</li>
                                <li>
                                    <span className="font-bold text-red-600">【重要】</span>ユーザーは、本サービスの利用（フォーム送信）をもって、以下の情報を提携エージェントに対して提供することに同意したものとみなします。
                                    <ul className="list-disc list-outside pl-5 mt-1 space-y-1 text-gray-600">
                                        <li>提供する情報：氏名、電話番号、メールアドレス、大学名、卒業年度、診断結果（志向性、希望条件等）、その他本サービス内でユーザーが入力した情報。</li>
                                        <li>提供の目的：提携エージェントからのキャリアカウンセリング、求人紹介、スカウト連絡のため。</li>
                                        <li>提供の手段：サーバー経由でのデータ送信、または電磁的記録媒体による送付。</li>
                                    </ul>
                                </li>
                                <li>提携エージェントへの情報提供後に生じた個人情報の管理、利用、削除依頼等については、当該エージェントのプライバシーポリシーが適用され、当該エージェントが責任を負うものとします。</li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 border-l-4 border-indigo-500 pl-3">第5条（禁止事項）</h2>
                        <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                        <div className="pl-2">
                            <ol className="list-decimal list-outside pl-5 mt-2 space-y-1">
                                <li>虚偽の情報を登録する行為</li>
                                <li>本サービスの機能を不正に操作、妨害する行為</li>
                                <li>運営者、提携エージェント、他のユーザー、または第三者を誹謗中傷する行為</li>
                                <li>本サービスを通じて得た情報を、就職活動以外の目的（営利目的、宗教勧誘等）で利用する行為</li>
                                <li>その他、法令または公序良俗に違反する行為</li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 border-l-4 border-indigo-500 pl-3">第6条（免責事項）</h2>
                        <div className="pl-2">
                            <ol className="list-decimal list-outside pl-5 space-y-2">
                                <li>運営者は、本サービスを通じて提供される情報（提携エージェントの情報等）の真実性、合法性、適切性、有用性等について、いかなる保証も行いません。</li>
                                <li>運営者は、ユーザーが本サービスを利用したことによって就職・内定が決定することを保証しません。</li>
                                <li>ユーザーと提携エージェントとの間で生じたトラブル（連絡の不達、面接でのトラブル、契約内容の相違等）について、運営者は一切の責任を負いません。</li>
                                <li>運営者は、本サービスのシステム障害、通信回線の障害、データ消失等によりユーザーに生じた損害について、一切の責任を負いません。</li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 border-l-4 border-indigo-500 pl-3">第7条（サービス内容の変更等）</h2>
                        <p>運営者は、ユーザーに通知することなく、本サービスの内容を変更し、または提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold mb-3 border-l-4 border-indigo-500 pl-3">第8条（準拠法・裁判管轄）</h2>
                        <div className="pl-2">
                            <ol className="list-decimal list-outside pl-5 space-y-2">
                                <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                                <li>本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所（大阪地方裁判所）を専属的合意管轄裁判所とします。</li>
                            </ol>
                        </div>
                    </section>

                    <div className="pt-8 border-t border-gray-200 mt-8 text-right text-gray-600">
                        <p>制定日：2025年12月26日</p>
                        <p>運営者：AchoSystems（代表：古河 遼）</p>
                    </div>

                    {/* Footer Button Area */}
                    <div className="flex justify-center mt-12 mb-6">
                        {onClose ? (
                            <button
                                onClick={onClose}
                                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                            >
                                閉じる
                            </button>
                        ) : (
                            <button
                                onClick={() => window.history.back()}
                                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                            >
                                戻る
                            </button>
                        )
                        }
                    </div>

                </div>

                {/* Scroll to Top Button */}
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-4 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 text-indigo-600 z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="トップに戻る"
                >
                    <ArrowUp className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default TermsOfService;
