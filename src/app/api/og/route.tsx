import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取参数
    const title = searchParams.get('title') || 'GLSL 学习平台';
    const description = searchParams.get('description') || '专业的 GLSL 着色器编程学习平台';
    const type = searchParams.get('type') || 'website';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          {/* 背景装饰 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
            }}
          />
          
          {/* 主要内容 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div
                style={{
                  color: 'white',
                  fontSize: '48px',
                  fontWeight: 'bold',
                }}
              >
                GL
              </div>
            </div>
            
            {/* 标题 */}
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 20px 0',
                lineHeight: 1.1,
                maxWidth: '900px',
              }}
            >
              {title}
            </h1>
            
            {/* 描述 */}
            <p
              style={{
                fontSize: '24px',
                color: '#cbd5e1',
                margin: 0,
                lineHeight: 1.4,
                maxWidth: '800px',
              }}
            >
              {description}
            </p>
            
            {/* 类型标签 */}
            {type !== 'website' && (
              <div
                style={{
                  marginTop: '30px',
                  padding: '8px 20px',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '20px',
                  color: '#60a5fa',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                {type === 'tutorial' ? '教程' : type === 'article' ? '文章' : type}
              </div>
            )}
          </div>
          
          {/* 底部品牌 */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              display: 'flex',
              alignItems: 'center',
              color: '#64748b',
              fontSize: '18px',
            }}
          >
            shader-learn.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}