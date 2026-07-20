import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom/client';
import CertificateTemplate, { CertificateData } from '../components/CertificateTemplate.tsx';

export async function downloadCertificatePDF(data: CertificateData, filename = 'certificate.pdf') {
  // 1. 임시 DOM에 렌더링
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(<CertificateTemplate data={data} />);

  // 2. 렌더링 완료 후 캡처
  await new Promise((resolve) => setTimeout(resolve, 300)); // 렌더링 대기
  const certElem = container.firstChild as HTMLElement;
  const canvas = await html2canvas(certElem, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  // 3. PDF 생성
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);

  // 4. DOM 정리
  root.unmount();
  document.body.removeChild(container);
} 