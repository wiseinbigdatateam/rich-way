import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-0">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-4">부자되는 플랫폼</h3>
            <p className="text-slate-300">내가 부자가 될 상인가!</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/diagnosis" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="부자진단">
                  부자진단
                </Link>
              </li>
              <li>
                <Link to="/coaching" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="부자코칭">
                  부자코칭
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="부자교육">
                  부자교육
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="부자상품">
                  부자상품
                </Link>
              </li>
              <li>
                <Link to="/playground" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="부자놀이터">
                  부자놀이터
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/faq" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="FAQ">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="1:1 문의">
                  1:1 문의
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="이용약관">
                  이용약관
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="개인정보처리방침">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">연락처</h4>
            <p className="text-slate-300">rich-way@wiseinc.co.kr</p>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>통신판매업 신고번호 제 2010 - 서울강남 - 00331 호 Copyright WISEINCOMPANY CO.,LTD ALL Right Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
