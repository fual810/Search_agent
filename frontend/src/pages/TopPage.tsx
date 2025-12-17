import { useNavigate } from 'react-router-dom'

function TopPage() {
  const navigate = useNavigate()

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="hero-content" style={{
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        padding: '40px 24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <p className="tag">就活エージェント マッチング</p>
          <h1 style={{ fontSize: '24px', margin: '0', lineHeight: '1.5' }}>
            たった数分、スワイプで<br />あなたに合うエージェントと出会う
          </h1>
        </div>

        <button
          className="primary"
          onClick={() => navigate('/survey')}
          style={{
            fontSize: '18px',
            padding: '16px 0',
            width: '100%',
            maxWidth: '280px',
            justifyContent: 'center'
          }}
        >
          はじめる
        </button>
      </div>
    </div>
  )
}

export default TopPage
