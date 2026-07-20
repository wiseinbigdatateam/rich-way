import React from 'react';
import { supabase } from '../lib/supabase';

export interface CertificateData {
  name: string;
  course: string;
  period: string;
  date: string;
  org: string;
  member_user_id: string;
}

const CertificateTemplate = React.forwardRef<HTMLDivElement, { data: CertificateData }>(
  ({ data }, ref) => {
    const [member, setMember] = React.useState<{ name: string } | null>(null);
    const [memberError, setMemberError] = React.useState<any>(null);

    React.useEffect(() => {
      const fetchMember = async () => {
        if (!data.member_user_id) {
          return;
        }
        const { data: memberData, error } = await supabase
          .from('members')
          .select('name')
          .eq('auth_user_id', data.member_user_id)
          .single();
        setMember(memberData);
        setMemberError(error);
      };
      fetchMember();
    }, [data.member_user_id]);

    return (
      <div
        ref={ref}
        style={{
          border: '6px solid #d4af37',
          borderRadius: '16px',
          padding: '32px 24px',
          width: 600,
          height: 850,
          margin: '0 auto',
          background: '#fff',
          fontFamily: 'serif',
          position: 'relative',
          color: '#222',
          boxSizing: 'border-box',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <img src="/corner-deco.png" alt="" style={{ position: 'absolute', top: 0, left: 0, width: 48, height: 48 }} />
        <img src="/corner-deco.png" alt="" style={{ position: 'absolute', top: 0, right: 0, width: 48, height: 48, transform: 'scaleX(-1)' }} />
        <img src="/corner-deco.png" alt="" style={{ position: 'absolute', bottom: 0, left: 0, width: 48, height: 48, transform: 'scaleY(-1)' }} />
        <img src="/corner-deco.png" alt="" style={{ position: 'absolute', bottom: 0, right: 0, width: 48, height: 48, transform: 'scale(-1, -1)' }} />

        <div style={{
          textAlign: 'center',
          marginBottom: 40,
          fontSize: 36,
          fontWeight: 'bold',
          letterSpacing: '0.2em',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          overflowWrap: 'break-word',
        }}>
          수강확인증
        </div>
        <div style={{
          marginBottom: 32,
          fontSize: 18,
          lineHeight: 2,
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          overflowWrap: 'break-word',
        }}>
          <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
            성&nbsp;&nbsp;&nbsp;&nbsp;명 : <b>{member?.name || data.name}</b>
          </div>
          <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
            교육과정 : <b>{data.course}</b>
          </div>
          <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
            교육기간 : <b>{data.period}</b>
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          margin: '40px 0',
          fontSize: 18,
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          overflowWrap: 'break-word',
        }}>
          위 수강 현황이 사실과 같음을 증명합니다.
        </div>
        <div style={{
          textAlign: 'center',
          margin: '32px 0 16px 0',
          fontSize: 18,
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          overflowWrap: 'break-word',
        }}>
          {data.date}
        </div>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 16,
          gap: 24,
        }}>
          <div style={{
            fontSize: 22,
            fontWeight: 'bold',
            letterSpacing: '0.2em',
            wordBreak: 'break-all',
            whiteSpace: 'pre-line',
            overflowWrap: 'break-word',
            textAlign: 'center',
            display: 'inline-block',
          }}>
            {data.org}
          </div>
          <img src="/stamp.png" alt="직인" style={{ width: 60 }} />
        </div>
      </div>
    );
  }
);

export default CertificateTemplate; 