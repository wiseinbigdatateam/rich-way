// 비밀번호 암호화 기능 테스트 스크립트
import bcrypt from 'bcryptjs';

// 테스트 비밀번호들
const testPasswords = [
  'weak123',           // 약함 (8자 미만)
  'weakpassword',      // 약함 (대문자, 숫자, 특수문자 없음)
  'MediumPass123',     // 보통 (특수문자 없음)
  'StrongPass123!',    // 강함 (모든 조건 충족)
  'Test@2024!',        // 강함 (모든 조건 충족)
];

// 비밀번호 강도 검증 함수 (복사)
const validatePasswordStrength = (password) => {
  const errors = [];
  let score = 0;

  // 최소 길이 검증
  if (password.length < 8) {
    errors.push('비밀번호는 8자 이상이어야 합니다.');
  } else {
    score += 1;
  }

  // 대문자 포함 검증
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 소문자 포함 검증
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 숫자 포함 검증
  if (!/\d/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 특수문자 포함 검증
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 강도 평가
  let strength = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

// 테스트 실행
console.log('🔐 비밀번호 암호화 기능 테스트 시작\n');

// 1. 비밀번호 강도 검증 테스트
console.log('1️⃣ 비밀번호 강도 검증 테스트:');
testPasswords.forEach(password => {
  const validation = validatePasswordStrength(password);
  console.log(`   비밀번호: "${password}"`);
  console.log(`   강도: ${validation.strength} (${validation.isValid ? '✅ 유효' : '❌ 유효하지 않음'})`);
  if (validation.errors.length > 0) {
    console.log(`   오류: ${validation.errors.join(', ')}`);
  }
  console.log('');
});

// 2. 비밀번호 해시화 테스트
console.log('2️⃣ 비밀번호 해시화 테스트:');
const testPassword = 'StrongPass123!';
console.log(`   원본 비밀번호: "${testPassword}"`);

try {
  const hashedPassword = await bcrypt.hash(testPassword, 12);
  console.log(`   해시화된 비밀번호: "${hashedPassword}"`);
  console.log(`   해시 길이: ${hashedPassword.length}자`);
  console.log(`   bcrypt 형식: ${hashedPassword.startsWith('$2') ? '✅ 올바름' : '❌ 잘못됨'}`);
  
  // 3. 비밀번호 검증 테스트
  console.log('\n3️⃣ 비밀번호 검증 테스트:');
  
  // 올바른 비밀번호 검증
  const isMatch = await bcrypt.compare(testPassword, hashedPassword);
  console.log(`   올바른 비밀번호 검증: ${isMatch ? '✅ 성공' : '❌ 실패'}`);
  
  // 잘못된 비밀번호 검증
  const isWrongMatch = await bcrypt.compare('WrongPassword123!', hashedPassword);
  console.log(`   잘못된 비밀번호 검증: ${!isWrongMatch ? '✅ 성공' : '❌ 실패'}`);
  
  // 4. 동일한 비밀번호의 다른 해시 테스트
  console.log('\n4️⃣ 동일한 비밀번호의 다른 해시 테스트:');
  const hashedPassword2 = await bcrypt.hash(testPassword, 12);
  console.log(`   첫 번째 해시: ${hashedPassword.substring(0, 20)}...`);
  console.log(`   두 번째 해시: ${hashedPassword2.substring(0, 20)}...`);
  console.log(`   해시가 다른가?: ${hashedPassword !== hashedPassword2 ? '✅ 예 (Salt 적용됨)' : '❌ 아니오'}`);
  
  // 두 해시 모두로 검증
  const [match1, match2] = await Promise.all([
    bcrypt.compare(testPassword, hashedPassword),
    bcrypt.compare(testPassword, hashedPassword2)
  ]);
  console.log(`   첫 번째 해시 검증: ${match1 ? '✅ 성공' : '❌ 실패'}`);
  console.log(`   두 번째 해시 검증: ${match2 ? '✅ 성공' : '❌ 실패'}`);
  
  console.log('\n🎉 모든 테스트 완료!');
} catch (error) {
  console.error('❌ 테스트 중 오류 발생:', error);
}
