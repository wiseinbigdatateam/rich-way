import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const privacySections = [
  { id: "intro", label: "개인정보처리방침 안내" },
  { id: "purpose", label: "1. 개인정보의 수집 및 이용 목적" },
  { id: "items", label: "2. 수집하는 개인정보 항목 및 수집방법" },
  { id: "period", label: "3. 수집하는 개인정보의 보유 및 이용기간" },
  { id: "destruction", label: "4. 개인정보의 파기절차 및 방법" },
  { id: "provision", label: "5. 개인정보의 제공 및 공유" },
  { id: "consignment", label: "6. 개인정보처리 위탁" },
  { id: "auto", label: "7. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항" },
  { id: "protection", label: "8. 개인정보보호를 위한 기술적/관리적 대책" },
  { id: "rights", label: "9. 이용자 권리와 그 행사방법" },
  { id: "manager", label: "10. 개인정보 보호책임자 및 상담·신고" },
  { id: "etc", label: "11. 부칙" },
];

const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Header />
    <main className="flex-1 py-8 px-2 sm:px-4 md:px-8 lg:px-0">
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">개인정보처리방침</h1>
        {/* 목차 */}
        <nav aria-label="개인정보처리방침 목차" className="mb-8">
          <ul className="flex flex-wrap gap-2 justify-center text-sm md:text-base">
            {privacySections.map(section => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded transition" tabIndex={0} aria-label={section.label}>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="prose max-w-none text-gray-800 leading-relaxed">
          <section id="intro">
            <p>주식회사 와이즈인컴퍼니(이하 "회사")의 Rich Way 솔루션(이하 "Rich Way")은 이용자의 개인정보보호를 매우 중요시 하며, 『개인정보 보호법』, 『정보통신망 이용촉진 및 정보보호 등에 관한 법률』 등 개인정보와 관련된 법령상의 개인정보보호 규정을 준수하고 있습니다.</p>
            <p>회사는 아래와 같이 개인정보처리방침을 명시하여 이용자가 회사에 제공한 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치를 취하는지 알려드립니다. 회사의 개인정보처리방침은 법령 및 고시 등의 변경 또는 회사의 약관 및 내부 정책에 따라 변경될 수 있으며 이를 개정하는 경우 회사는 변경사항에 대하여 서비스 화면에 개시하거나 이용자에게 고지합니다.</p>
            <p>이용자는 개인정보의 수집, 이용 등과 관련한 아래 사항에 대하여 원하지 않는 경우 동의를 거부할 수 있습니다. 다만, 이용자가 동의를 거부하는 경우 서비스의 전부 또는 일부를 이용할 수 없음을 알려드립니다.</p>
            <p>이용자께서는 홈페이지 방문 시 수시로 확인하시기 바랍니다.</p>
            <ul className="list-disc pl-6 mt-4">
              <li>개인정보의 수집 및 이용 목적</li>
              <li>수집하는 개인정보 항목 및 수집방법</li>
              <li>수집하는 개인정보의 보유 및 이용기간</li>
              <li>개인정보의 파기절차 및 방법</li>
              <li>개인정보의 제공 및 공유</li>
              <li>개인정보처리 위탁</li>
              <li>개인정보 자동 수집 장치의 설치,운영 및 거부에 관한 사항</li>
              <li>개인정보보호를 위한 기술적/관리적 대책</li>
              <li>이용자 권리와 그 행사방법</li>
              <li>개인정보 보호책임자 및 상담,신고</li>
              <li>부칙</li>
            </ul>
          </section>

          <h2 id="purpose" className="text-xl font-bold text-blue-700 mt-10 mb-2">1. 개인정보의 수집 및 이용 목적</h2>
          <p>개인정보는 생존하는 개인에 관한 정보로서 회원 개인을 식별할 수 있는 정보(당해 정보만으로는 특정 개인을 식별할 수 없더라도 다른 정보와 용이하게 결합하여 식별할 수 있는 것을 포함)를 말합니다. 회사가 수집한 개인정보는 다음의 목적을 위해 활용합니다.</p>
          <ol className="list-decimal pl-6">
            <li>서비스 제공 및 서비스 제공에 따른 요금정산<br />콘텐츠 제공, 물품배송 또는 청구서 등 발송, 금융거래 본인 인증 및 금융 서비스, 구매 및 요금 결제, 요금 추심</li>
            <li>회원 관리<br />회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 가입 및 가입횟수 제한, 분쟁 조정을 위한 기록보존, 불만처리 등 민원처리, 고지사항 전달, 회원탈퇴 의사의 확인</li>
            <li>신규 서비스 개발, 기능개선 마케팅 및 광고에 활용<br />신규 서비스(제품) 개발 및 특화, 맞춤형 서비스 제공, 기능 개선, 인구통계학적 특성에 따른 서비스 제공 및 광고게재, 접속 빈도 파악, 회원의 서비스 이용에 대한 통계, 이벤트 등 광고성 정보 제공 및 이벤트 참여 기회 제공(이용자의 개인정보는 광고를 의뢰한 개인이나 단체에는 제공되지 않습니다.)</li>
          </ol>

          <h2 id="items" className="text-xl font-bold text-blue-700 mt-10 mb-2">2. 수집하는 개인정보 항목 및 수집방법</h2>
          <p className="font-semibold">[수집하는 개인정보 항목]</p>
          <ol className="list-decimal pl-6">
            <li>회사는 최초 회원가입 또는 서비스 이용 시 회원식별 및 최적화된 서비스 제공을 위해 아래와 같은 정보를 수집합니다.<br />
              (필수항목) 아이디, 비밀번호, 이메일, 생년월일<br />
              (선택항목) 이름, 소속(직장명), 직무, 직책, 일반전화번호, 휴대전화번호<br />
              <span className="text-xs">＊다만, 회사는 유료 서비스 이용, 법정대리인 동의 등 관련 법률에 따라 본인확인이 필요한 경우에는 필요한 정보를 별도 동의 절차를 거쳐 수집할 수 있습니다.</span>
            </li>
            <li>서비스 이용과정이나 사업 처리과정에서 아래와 같은 정보들이 생성되어 수집될 수 있습니다.<br />서비스 이용기록, 접속로그, 쿠키, 접속IP 정보, 결제기록, 불량이용 기록</li>
            <li>서비스 이용 과정에서 이용자의 별도 동의 절차를 거쳐 개인정보가 추가 수집될 수 있습니다.</li>
          </ol>
          <p className="font-semibold mt-4">[동의를 받고 추가 수집되는 개인정보]</p>
          <table className="w-full text-sm border mt-2 mb-4">
            <thead>
              <tr className="bg-slate-100">
                <th className="border px-2 py-1">서비스명</th>
                <th className="border px-2 py-1">수집·이용 목적</th>
                <th className="border px-2 py-1">수집하는 항목</th>
                <th className="border px-2 py-1">보유·이용 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">광고성 메일 수신</td>
                <td className="border px-2 py-1">이벤트 등 광고성 메일 발송</td>
                <td className="border px-2 py-1">아이디, 이메일 주소</td>
                <td className="border px-2 py-1">회원 탈퇴시 까지</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">고객센터 [메일문의]</td>
                <td className="border px-2 py-1">문의내역 확인과 답변처리</td>
                <td className="border px-2 py-1">아이디, 이메일 주소, 회원의 문의/답변내용에 포함된 개인정보</td>
                <td className="border px-2 py-1">3년 보관 후 파기</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">서비스 장애/오류 신고</td>
                <td className="border px-2 py-1">문의내역 확인과 답변처리</td>
                <td className="border px-2 py-1">아이디 또는 이름, 이메일주소, 회원의 문의/답변 내용에 포함된 개인정보</td>
                <td className="border px-2 py-1">3년 보관 후 파기</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">권리침해 신고, 권리침해 소명</td>
                <td className="border px-2 py-1">신고 내역 확인 및 처리</td>
                <td className="border px-2 py-1">성명, 연락처, 요청내용에 포함된 개인정보</td>
                <td className="border px-2 py-1">3년 보관 후 파기</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">나의 로그인 IP</td>
                <td className="border px-2 py-1">로그인 가능한 IP주소 정보식별</td>
                <td className="border px-2 py-1">IP정보, 접속장소</td>
                <td className="border px-2 py-1">회원탈퇴 혹은 서비스 해지 시 까지</td>
              </tr>
            </tbody>
          </table>
          <p className="font-semibold">[수집방법]</p>
          <ol className="list-decimal pl-6">
            <li>유/무선 홈페이지 및 어플리케이션, 서면 양식, 이메일주소, 전화, 팩스, 상담 게시판, 배송 요청</li>
            <li>제휴사의 제공</li>
            <li>생성정보 수집 툴을 통한 수집</li>
          </ol>

          <h2 id="period" className="text-xl font-bold text-blue-700 mt-10 mb-2">3. 수집하는 개인정보의 보유 및 이용기간</h2>
          <p>원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.</p>
          <ol className="list-decimal pl-6">
            <li>상거래 관련 보존 개인정보<br />
              ① 보존항목 : 상거래이력<br />
              ② 보존근거 : 상법, 전자상거래 등에서의 소비자보호에 관한 법률<br />
              ③ 보존기간:<br />
              <ul className="list-disc pl-6">
                <li>표시/광고에 관한 기록 :6개월</li>
                <li>계약 또는 청약철회 등의 공급에 관한 기록 : 5년</li>
                <li>대금결제 및 재화 동의 공급에 관한 기록 : 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</li>
                <li>신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년</li>
              </ul>
            </li>
            <li>로그기록 관련 보존 개인정보<br />
              ① 보존항목 : 접속기록<br />
              ② 보존근거: 통신비밀보호법<br />
              ③ 보존기간: 3개월
            </li>
          </ol>

          <h2 id="destruction" className="text-xl font-bold text-blue-700 mt-10 mb-2">4. 개인정보의 파기절차 및 방법</h2>
          <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성되거나, 보유 및 이용기간이 경과된 후에는 해당 정보를 지체 없이 파기합니다.<br />
          다만, 정보통신망 이용촉진 및 정보보호 등에 관한 법률에 따라 1년 간 이용 기록이 없는 회원의 경우, 이용 중인 회원의 개인정보와 별도 분리하여 휴면계정으로 안전하게 보관합니다. 휴면계정의 전환일로부터 3년이 경과되면 파기됩니다.</p>
          <ol className="list-decimal pl-6">
            <li>파기절차<br />이용자가 회원가입 등을 위해 입력하신 정보는 이용목적이 달성된 후 파기됩니다. 다만, 법령에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기될 수 있습니다. 동 개인정보는 법률에 의한 경우가 아니고서는 보전되는 이외의 다른 목적으로 이용되지 않습니다.</li>
            <li>파기방법<br />종이(인쇄물, 서면 등)에 출력된 개인정보는 세절기로 세절하거나 소각을 통하여 파기하고 전자적 파일형태로 저장된 개인정보는 복원이 불가능한 방법으로 영구 삭제합니다.</li>
          </ol>

          <h2 id="provision" className="text-xl font-bold text-blue-700 mt-10 mb-2">5. 개인정보의 제공 및 공유</h2>
          <p>원칙적으로 회사는 이용자의 개인정보를 수집 및 이용목적에 한해서만 이용하며 타인 또는 타 기업·기관에 공개하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>
          <ol className="list-decimal pl-6">
            <li>이용자들이 사전에 동의한 경우<br />정보수집 또는 정보제공 이전에 이용자께 비즈니스 파트너가 누구인지, 어떤 정보가 왜 필요한지, 그리고 언제까지 어떻게 보호/관리되는지 알려드리고 동의를 구하는 절차를 거치게 되며, 이용자께서 동의하지 않는 경우에는 추가적인 정보를 수집하거나 비즈니스 파트너와 공유하지 않습니다.</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ol>

          <h2 id="consignment" className="text-xl font-bold text-blue-700 mt-10 mb-2">6. 개인정보처리 위탁</h2>
          <p>회사는 서비스 이행을 위해 아래와 같이 외부 전문업체에 위탁하여 운영하고 있습니다.<br />서비스를 이행하는 과정에 따라 개인정보를 제공하는 업체는 달라지며 해당 서비스 이행을 위하여 업무위탁이 반드시 필요한 업체에만 해당 서비스를 이용하는 이용자의 개인정보에 한하여 전달합니다.</p>
          <table className="w-full text-sm border mt-2 mb-4">
            <thead>
              <tr className="bg-slate-100">
                <th className="border px-2 py-1">개인정보를 제공받는자</th>
                <th className="border px-2 py-1">개인정보 이용목적</th>
                <th className="border px-2 py-1">제공하는 개인정보</th>
                <th className="border px-2 py-1">개인정보 보유 및 이용기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">(주)다우데이타</td>
                <td className="border px-2 py-1">유료서비스 결제 대행</td>
                <td className="border px-2 py-1">금융결제정보</td>
                <td className="border px-2 py-1">서비스 제공기간</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">(주)알리는사람들</td>
                <td className="border px-2 py-1">문자서비스 전송 시스템 운영</td>
                <td className="border px-2 py-1">문자서비스 전송 정보</td>
                <td className="border px-2 py-1">서비스 제공기간</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">심플렉스인터넷(주)</td>
                <td className="border px-2 py-1">서버운영</td>
                <td className="border px-2 py-1">회사가 보유한 개인정보 일체</td>
                <td className="border px-2 py-1">위탁 계약기간</td>
              </tr>
            </tbody>
          </table>

          <h2 id="auto" className="text-xl font-bold text-blue-700 mt-10 mb-2">7. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2>
          <p>이용자 개개인에게 개인화되고 맞춤화된 서비스를 제공하기 위해서 회사는 이용자의 정보를 저장하고 수시로 불러오는 "쿠키(cookie)"를 사용합니다.<br />쿠키는 웹사이트를 운영하는데 이용되는 서버가 사용자의 브라우저에게 보내는 조그마한 데이터 꾸러미로 이용자 컴퓨터의 하드디스크에 저장됩니다.</p>
          <ol className="list-decimal pl-6">
            <li>쿠키의 사용 목적<br />회원과 비회원의 접속 빈도나 방문 시간 등의 분석, 이용자의 취향과 관심분야의 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공</li>
            <li>쿠키 설정 거부 방법<br />이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.<br />* 설정방법 예(인터넷 익스플로러의 경우): 웹 브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 (단, 쿠키 설치를 거부하였을 경우 로그인이 필요한 일부 서비스의 이용이 어려울 수 있습니다.)</li>
          </ol>

          <h2 id="protection" className="text-xl font-bold text-blue-700 mt-10 mb-2">8. 개인정보보호를 위한 기술적/관리적 대책</h2>
          <ol className="list-decimal pl-6">
            <li>기술적인 대책<br />
              ① 회사는 이용자의 개인정보를 관련 법률규정 및 내부관리계획정책에 따라 보안기능을 통해 안전하게 보호하고 있습니다.<br />
              ② 회사는 백신프로그램을 이용하여 컴퓨터 바이러스에 의한 피해를 방지하기 위한 조치를 취하고 있습니다. 백신프로그램은 주기적으로 업데이트되며 갑작스런 바이러스가 출현 될 경우 백신이 나오는 즉시 이를 적용함으로써 개인정보가 침해되는 것을 방지하고 있습니다.<br />
              ③ 회사는 이용자의 비밀번호를 암호화하여 저장 및 관리하고 있으며, 네트워크상의 개인정보를 안전하게 전송할 수 있는 보안장치를 채택하고 있습니다.<br />
              ④ 회사는 해킹 등에 의해 이용자의 개인정보가 유출되는 것을 방지하기 위하여, 외부로부터의 침입을 차단하는 장치를 이용하고 있으며 365일 침입을 감시하고 있습니다.
            </li>
            <li>관리적인 대책<br />
              ① 위와 같은 노력 이외에 이용자 스스로도 제3자에게 비밀번호 등이 노출되지 않도록 주의하셔야 합니다. 특히 비밀번호 등이 공공장소에 설치한 PC를 통해 유출되지 않도록 항상 유의하시기 바랍니다. 이용자의 ID와 비밀번호는 반드시 본인만 사용하시고 비밀번호를 자주 바꿔주시는 것이 좋습니다.<br />
              ② 회사는 개인정보 처리직원을 개인정보 보호업무를 수행하는 자 및 업무상 개인정보의 처리가 불가피 한 자로 엄격히 제한하고 담당직원에 대한 수시 교육을 통하여 개인정보처리방침의 준수를 강조하고 있습니다.
            </li>
          </ol>

          <h2 id="rights" className="text-xl font-bold text-blue-700 mt-10 mb-2">9. 이용자 권리와 그 행사방법</h2>
          <p>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.<br />이용자의 개인정보 조회·수정을 위해서는 "회원정보 수정"을 통하여 가능하며, 가입해지 시에는 "회원탈퇴"를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다. 혹은 개인정보보호책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.</p>
          <p>이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다.<br />회사는 이용자의 요청에 의해 해지 또는 삭제된 개인정보는 "회사가 수집하는 개인정보의 보유 및 이용기간"에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.</p>

          <h2 id="manager" className="text-xl font-bold text-blue-700 mt-10 mb-2">10. 개인정보 보호책임자 및 상담·신고</h2>
          <div className="bg-slate-50 border border-slate-200 rounded p-4 mt-2">
            <p className="font-medium">개인정보 보호책임자: 김원표 대표 | 02-558-5144 | wise@wiseinc.co.kr</p>
            <p className="font-medium">개인정보 보호담당자: 김진성 부장(소속: 빅데이터팀) | 02-558-5144 | jinseong-kin@wiseinc.co.kr</p>
            <p className="mt-2">개인정보침해에 관한 상담이 필요한 경우에는 아래 기관으로 문의할 수 있습니다.</p>
            <ul className="list-disc pl-6 mt-2">
              <li>개인정보침해신고센터: 118 | <a href="http://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">privacy.kisa.or.kr</a></li>
              <li>대검찰청 사이버범죄수사단: 02-3480-3571 | <a href="mailto:cybercid@spo.go.kr" className="text-blue-600 underline">cybercid@spo.go.kr</a></li>
              <li>경찰청 사이버 테러 대응센터: 1566-0112 | <a href="http://www.ctrc.go.kr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ctrc.go.kr</a></li>
            </ul>
          </div>

          <h2 id="etc" className="text-xl font-bold text-blue-700 mt-10 mb-2">11. 부칙</h2>
          <div className="bg-slate-50 border border-slate-200 rounded p-4 mt-2">
            <ol className="list-decimal pl-6">
              <li>회사는 본 개인정보처리방침을 변경하는 경우 그 변경 사유 및 적용일자를 명시하여 현행 개인정보처리방침과 함께 적용일자 10일전부터 적용일전까지 서비스 화면에 고지합니다. 다만, 이용자의 권리 또는 의무에 중요한 내용의 변경이 있을 경우에는 최소 30일전에 고지합니다.</li>
              <li>회사가 제1항에 따라 변경 내용을 고지하면서 변경 적용일까지 거부의사를 표시하지 않으면 의사표시가 된 것으로 본다는 뜻을 고지하였음에도 불구하고 이용자가 명시적으로 거부의사를 표시하지 아니하는 경우 이용자가 변경 내용에 동의한 것으로 간주 합니다.</li>
              <li>회사는 제 2항에도 불구하고 이용자로부터 개인정보를 추가 수집하거나 제3자에게 제공하는 경우에는 이용자 본인으로부터 이에 대하여 별도 동의 절차를 거칩니다.</li>
            </ol>
            <p className="font-medium mt-2">본 개인정보 처리방침은 2020년 07월 10일부터 적용됩니다.<br />개인정보처리방침 변경공고일자 : 2020년 07월 10일<br />개인정보처리방침 시행일자 : 2020년 07월 10일</p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicyPage; 